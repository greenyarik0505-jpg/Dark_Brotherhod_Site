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
        "firebase": "https://dark-club-57e07-default-rtdb.europe-west1.firebasedatabase.app"
    },
    "Holy Empire (Священная Империя)": {
        "tag": "#2QCLRR800",
        "firebase": "https://brawlclub-432dd-default-rtdb.europe-west1.firebasedatabase.app"
    }
}

def load_config():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"api_key": ""}

def save_config(api_key):
    try:
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump({"api_key": api_key}, f)
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

def update_firebase_data(firebase_url, new_data):
    url = f"{firebase_url.rstrip('/')}/brawlClubData.json"
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
    selected_club = combo_club.get()

    if not api_key or not club_tag or not firebase_url:
        messagebox.showerror("Ошибка", "API Ключ не может быть пустым!")
        return

    save_config(api_key)
    
    btn_update.config(state=tk.DISABLED, text="Обновление...")
    app.update()

    try:
        bs_members = get_brawl_stars_members(api_key, club_tag)
        fb_data = get_firebase_data(firebase_url)
        
        if "members" not in fb_data:
            raise Exception("В базе данных Firebase нет списка участников (members).")
            
        fb_members = fb_data["members"]
        bs_map = {m["name"]: m for m in bs_members}
        
        updated_count = 0
        not_found_names = []
        for fb_m in fb_members:
            name = fb_m.get("name")
            if name in bs_map:
                bs_player = bs_map[name]
                old_trophies = fb_m.get("trophies", 0)
                new_trophies = bs_player.get("trophies", 0)
                if old_trophies != new_trophies:
                    fb_m["trophies"] = new_trophies
                    updated_count += 1
            else:
                not_found_names.append(name)
                
        update_firebase_data(firebase_url, fb_data)
        
        msg = f"Кубки успешно обновлены у {updated_count} участников клуба {selected_club}!"
        if not_found_names:
            msg += f"\n\nНе удалось найти {len(not_found_names)} игроков в официальном клане (возможно, изменён ник или их нет в клубе): {', '.join(not_found_names[:5])}" + ("..." if len(not_found_names)>5 else "")
            
        messagebox.showinfo("Успех!", msg)
        
    except Exception as e:
        messagebox.showerror("Ошибка при обновлении", str(e))
    finally:
        btn_update.config(state=tk.NORMAL, text="🔄 Обновить кубки")

# UI Setup
app = tk.Tk()
app.title("Brawl Stars Auto Updater - Multi Club")
app.geometry("550x380")
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

tk.Label(app, text="Brawl Stars API Key (из developer.brawlstars.com):", font=("Arial", 10, "bold")).pack(anchor="w")
entry_api_key = tk.Entry(app, width=80)
entry_api_key.pack(pady=5)
entry_api_key.insert(0, config.get("api_key", ""))
make_context_menu(entry_api_key)

tk.Label(app, text="Выберите Клуб для обновления:", font=("Arial", 10, "bold")).pack(anchor="w", pady=(15, 0))
combo_club = ttk.Combobox(app, values=list(CLUBS.keys()), width=77, state="readonly")
combo_club.pack(pady=5)
combo_club.bind("<<ComboboxSelected>>", on_club_change)
combo_club.current(0)

tk.Label(app, text="Тег Клуба:", font=("Arial", 10)).pack(anchor="w", pady=(10, 0))
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
