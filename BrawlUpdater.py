import tkinter as tk
from tkinter import ttk, messagebox
import requests
import json
import os
import urllib.parse

CONFIG_FILE = "brawl_updater_config.json"

CLUBS = {
    "Dark Brotherhood": {
        "tag": "#809L8LRUL",
        "firebase": "https://dark-club-57e07-default-rtdb.europe-west1.firebasedatabase.app",
        "web_api_key": "AIzaSyCh14CMKFKwVqtEz6s9mSxKyMmxoEFscFc"
    },
    "Holy Empire (Священная Империя)": {
        "tag": "#2QCLRR800",
        "firebase": "https://brawlclub-432dd-default-rtdb.europe-west1.firebasedatabase.app",
        "web_api_key": "AIzaSyDzvGVlyssX3t-ZZJzmdydaiY-nBKBou7c"
    }
}

def load_config():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"api_key": "", "fb_email": "", "fb_password": ""}

def save_config(api_key, fb_email, fb_password):
    try:
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump({"api_key": api_key, "fb_email": fb_email, "fb_password": fb_password}, f)
    except Exception as e:
        print("Failed to save config", e)

def get_brawl_stars_members(api_key, club_tag):
    tag = urllib.parse.quote(club_tag)
    url = f"https://api.brawlstars.com/v1/clubs/{tag}/members"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json().get("items", [])
    else:
        raise Exception(f"Brawl Stars API Error {response.status_code}: {response.text}")

def get_firebase_token(web_api_key, email, password):
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={web_api_key}"
    payload = {
        "email": email,
        "password": password,
        "returnSecureToken": True
    }
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        return response.json().get("idToken")
    else:
        err = response.json().get("error", {}).get("message", response.text)
        raise Exception(f"Ошибка входа в Firebase: {err}")

def get_firebase_data(firebase_url):
    url = f"{firebase_url.rstrip('/')}/brawlClubData.json"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if not data:
            raise Exception("База данных Firebase пуста.")
        return data
    else:
        raise Exception(f"Firebase API Error {response.status_code}: {response.text}")

def update_firebase_data(firebase_url, new_data, id_token):
    url = f"{firebase_url.rstrip('/')}/brawlClubData.json?auth={id_token}"
    response = requests.put(url, json=new_data)
    if response.status_code != 200:
        raise Exception(f"Firebase Update Error {response.status_code}: {response.text}")

def on_club_change(event=None):
    selected = combo_club.get()
    if selected in CLUBS:
        entry_club_tag.config(state=tk.NORMAL)
        entry_club_tag.delete(0, tk.END)
        entry_club_tag.insert(0, CLUBS[selected]["tag"])
        entry_club_tag.config(state="readonly")
        
        entry_firebase_url.config(state=tk.NORMAL)
        entry_firebase_url.delete(0, tk.END)
        entry_firebase_url.insert(0, CLUBS[selected]["firebase"])
        entry_firebase_url.config(state="readonly")

def on_update_click():
    api_key = entry_api_key.get().strip()
    club_tag = entry_club_tag.get().strip()
    firebase_url = entry_firebase_url.get().strip()
    fb_email = entry_fb_email.get().strip()
    fb_pass = entry_fb_pass.get().strip()
    selected_club = combo_club.get()
    web_api_key = CLUBS[selected_club]["web_api_key"]

    if not api_key or not club_tag or not firebase_url or not fb_email or not fb_pass:
        messagebox.showerror("Ошибка", "Заполните все поля, включая Email и Пароль администратора!")
        return

    save_config(api_key, fb_email, fb_pass)
    
    btn_update.config(state=tk.DISABLED, text="Обновление...")
    app.update()

    try:
        id_token = get_firebase_token(web_api_key, fb_email, fb_pass)
        bs_members = get_brawl_stars_members(api_key, club_tag)
        fb_data = get_firebase_data(firebase_url)
        
        # Mapping API roles to Russian roles
        role_map = {
            "president": "Президент",
            "vicePresident": "Вице-президент",
            "senior": "Ветеран",
            "member": "Участник"
        }
        
        fb_members = fb_data.get("members", [])
        
        # Map existing Firebase members by name to preserve avatars and IDs
        old_fb_map = {m.get("name", ""): m for m in fb_members}
        
        new_fb_members = []
        added_count = 0
        updated_count = 0
        
        import time
        import random
        
        for i, bs_m in enumerate(bs_members):
            name = bs_m.get("name", "Unknown")
            new_trophies = bs_m.get("trophies", 0)
            raw_role = bs_m.get("role", "member")
            ru_role = role_map.get(raw_role, "Участник")
            
            if name in old_fb_map:
                # Player exists, update trophies and role
                old_m = old_fb_map[name]
                if old_m.get("trophies") != new_trophies or old_m.get("role") != ru_role:
                    updated_count += 1
                    
                old_m["trophies"] = new_trophies
                old_m["role"] = ru_role
                new_fb_members.append(old_m)
                # Remove from map so we know who is left
                del old_fb_map[name]
            else:
                # New player!
                added_count += 1
                new_id = f"m_auto_{int(time.time())}_{i}_{random.randint(100,999)}"
                new_fb_members.append({
                    "id": new_id,
                    "name": name,
                    "role": ru_role,
                    "trophies": new_trophies,
                    "avatar": "👤"
                })
                
        removed_count = len(old_fb_map)
        
        # Overwrite the members array
        fb_data["members"] = new_fb_members
                
        update_firebase_data(firebase_url, fb_data, id_token)
        
        msg = f"✅ Синхронизация клуба {selected_club} завершена!\n\n"
        msg += f"• Обновлены кубки/роли у: {updated_count} чел.\n"
        msg += f"• Добавлены новые игроки: {added_count} чел.\n"
        msg += f"• Удалены (вышли из клуба): {removed_count} чел.\n\n"
        msg += "Теперь сайт на 100% совпадает с игрой!"
            
        messagebox.showinfo("Успех!", msg)
        
    except Exception as e:
        messagebox.showerror("Ошибка при обновлении", str(e))
    finally:
        btn_update.config(state=tk.NORMAL, text="🔄 Обновить кубки")

# UI Setup
app = tk.Tk()
app.title("Brawl Stars Auto Updater - Multi Club")
app.geometry("550x500")
app.configure(padx=20, pady=20)

def make_context_menu(widget):
    menu = tk.Menu(widget, tearoff=0)
    menu.add_command(label="Копировать (Ctrl+C)", command=lambda: widget.event_generate("<<Copy>>"))
    menu.add_command(label="Вставить (Ctrl+V)", command=lambda: widget.event_generate("<<Paste>>"))
    menu.add_command(label="Вырезать (Ctrl+X)", command=lambda: widget.event_generate("<<Cut>>"))
    
    def show_menu(event):
        menu.tk_popup(event.x_root, event.y_root)
        
    widget.bind("<Button-3>", show_menu)

config = load_config()

tk.Label(app, text="1. Brawl Stars API Key (из developer.brawlstars.com):", font=("Arial", 10, "bold")).pack(anchor="w")
entry_api_key = tk.Entry(app, width=80)
entry_api_key.pack(pady=5)
entry_api_key.insert(0, config.get("api_key", ""))
make_context_menu(entry_api_key)

tk.Label(app, text="2. Email админа Firebase:", font=("Arial", 10, "bold")).pack(anchor="w", pady=(10, 0))
entry_fb_email = tk.Entry(app, width=80)
entry_fb_email.pack(pady=5)
entry_fb_email.insert(0, config.get("fb_email", ""))
make_context_menu(entry_fb_email)

tk.Label(app, text="3. Пароль админа Firebase:", font=("Arial", 10, "bold")).pack(anchor="w", pady=(10, 0))
entry_fb_pass = tk.Entry(app, width=80, show="*")
entry_fb_pass.pack(pady=5)
entry_fb_pass.insert(0, config.get("fb_password", ""))
make_context_menu(entry_fb_pass)

tk.Label(app, text="4. Выберите Клуб для обновления:", font=("Arial", 10, "bold")).pack(anchor="w", pady=(15, 0))
combo_club = ttk.Combobox(app, values=list(CLUBS.keys()), width=77, state="readonly")
combo_club.pack(pady=5)
combo_club.bind("<<ComboboxSelected>>", on_club_change)
combo_club.current(0)

tk.Label(app, text="Тег Клуба:", font=("Arial", 10)).pack(anchor="w", pady=(5, 0))
entry_club_tag = tk.Entry(app, width=80)
entry_club_tag.pack(pady=2)
make_context_menu(entry_club_tag)

tk.Label(app, text="База Firebase:", font=("Arial", 10)).pack(anchor="w", pady=(5, 0))
entry_firebase_url = tk.Entry(app, width=80)
entry_firebase_url.pack(pady=2)
make_context_menu(entry_firebase_url)

on_club_change()

btn_update = tk.Button(app, text="🔄 Обновить кубки", font=("Arial", 12, "bold"), bg="#4CAF50", fg="white", height=2, command=on_update_click)
btn_update.pack(pady=20, fill="x")

tk.Label(app, text="* Обновление происходит по точному совпадению никнеймов игроков.", fg="gray").pack()

app.mainloop()
