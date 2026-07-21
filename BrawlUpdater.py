import tkinter as tk
from tkinter import messagebox
import requests
import json
import os
import urllib.parse

CONFIG_FILE = "brawl_updater_config.json"

def load_config():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"api_key": "", "club_tag": "#809L8LRUL", "firebase_url": "https://dark-club-57e07-default-rtdb.europe-west1.firebasedatabase.app"}

def save_config(api_key, club_tag, firebase_url):
    config = {
        "api_key": api_key,
        "club_tag": club_tag,
        "firebase_url": firebase_url
    }
    try:
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(config, f)
    except Exception as e:
        print("Failed to save config", e)

def get_brawl_stars_members(api_key, club_tag):
    # Format tag: replace # with %23
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
            raise Exception("Firebase database is empty or not found.")
        return data
    else:
        raise Exception(f"Firebase API Error {response.status_code}: {response.text}")

def update_firebase_data(firebase_url, new_data):
    url = f"{firebase_url.rstrip('/')}/brawlClubData.json"
    response = requests.put(url, json=new_data)
    if response.status_code != 200:
        raise Exception(f"Firebase Update Error {response.status_code}: {response.text}")

def on_update_click():
    api_key = entry_api_key.get().strip()
    club_tag = entry_club_tag.get().strip()
    firebase_url = entry_firebase_url.get().strip()

    if not api_key or not club_tag or not firebase_url:
        messagebox.showerror("Ошибка", "Заполните все поля!")
        return

    save_config(api_key, club_tag, firebase_url)
    
    btn_update.config(state=tk.DISABLED, text="Обновление...")
    app.update()

    try:
        # 1. Fetch from Brawl Stars
        bs_members = get_brawl_stars_members(api_key, club_tag)
        
        # 2. Fetch from Firebase
        fb_data = get_firebase_data(firebase_url)
        
        if "members" not in fb_data:
            raise Exception("В базе данных Firebase нет списка участников (members).")
            
        fb_members = fb_data["members"]
        
        # 3. Create mapping from BS
        # Note: we use names to match
        bs_map = {m["name"]: m for m in bs_members}
        
        updated_count = 0
        for fb_m in fb_members:
            name = fb_m.get("name")
            if name in bs_map:
                bs_player = bs_map[name]
                old_trophies = fb_m.get("trophies", 0)
                new_trophies = bs_player.get("trophies", 0)
                if old_trophies != new_trophies:
                    fb_m["trophies"] = new_trophies
                    updated_count += 1
                
                # Update role if needed (optional, keeping it simple for now)
                
        # 4. Save back to Firebase
        update_firebase_data(firebase_url, fb_data)
        
        messagebox.showinfo("Успех!", f"Кубки успешно обновлены у {updated_count} участников!")
        
    except Exception as e:
        messagebox.showerror("Ошибка при обновлении", str(e))
    finally:
        btn_update.config(state=tk.NORMAL, text="🔄 Обновить кубки")

# UI Setup
app = tk.Tk()
app.title("Brawl Stars Auto Updater")
app.geometry("500x350")
app.configure(padx=20, pady=20)

config = load_config()

tk.Label(app, text="Brawl Stars API Key:", font=("Arial", 10, "bold")).pack(anchor="w")
entry_api_key = tk.Entry(app, width=70)
entry_api_key.pack(pady=5)
entry_api_key.insert(0, config.get("api_key", ""))

tk.Label(app, text="Тег Клуба (с решеткой #):", font=("Arial", 10, "bold")).pack(anchor="w", pady=(10, 0))
entry_club_tag = tk.Entry(app, width=70)
entry_club_tag.pack(pady=5)
entry_club_tag.insert(0, config.get("club_tag", "#809L8LRUL"))

tk.Label(app, text="Ссылка на базу Firebase (без .json):", font=("Arial", 10, "bold")).pack(anchor="w", pady=(10, 0))
entry_firebase_url = tk.Entry(app, width=70)
entry_firebase_url.pack(pady=5)
entry_firebase_url.insert(0, config.get("firebase_url", "https://dark-club-57e07-default-rtdb.europe-west1.firebasedatabase.app"))

btn_update = tk.Button(app, text="🔄 Обновить кубки", font=("Arial", 12, "bold"), bg="#4CAF50", fg="white", height=2, command=on_update_click)
btn_update.pack(pady=25, fill="x")

tk.Label(app, text="* База данных обновляется по совпадению никнеймов.", fg="gray").pack()

app.mainloop()
