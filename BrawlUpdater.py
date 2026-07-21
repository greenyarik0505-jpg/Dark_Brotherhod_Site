import customtkinter as ctk
import tkinter.messagebox as messagebox
import requests
import json
import os
import urllib.parse
import time
import random

# Настройка VIP дизайна (CustomTkinter)
ctk.set_appearance_mode("dark")  # Modes: "System" (standard), "Dark", "Light"
ctk.set_default_color_theme("blue")  # Themes: "blue" (standard), "green", "dark-blue"

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
                data = json.load(f)
                # Migration check: if old format, ignore
                if "api_key" in data and isinstance(data["api_key"], str):
                    return {}
                return data
        except Exception:
            pass
    return {}

def save_config(config_data):
    try:
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(config_data, f, ensure_ascii=False, indent=4)
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

class BrawlUpdaterApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("Brawl Stars VIP Updater")
        self.geometry("600x620")
        self.resizable(False, False)

        self.config_data = load_config()

        # Заголовок
        self.title_label = ctk.CTkLabel(self, text="⚡ BRAWL STARS SYNC", font=ctk.CTkFont(size=24, weight="bold"), text_color="#00e5ff")
        self.title_label.pack(pady=(20, 10))
        
        # Контекстное меню для вставки мышкой
        import tkinter as tk
        self.context_menu = tk.Menu(self, tearoff=0)
        self.context_menu.add_command(label="Копировать", command=self.copy_text)
        self.context_menu.add_command(label="Вставить", command=self.paste_text)
        self.context_menu.add_command(label="Вырезать", command=self.cut_text)
        self.current_widget = None

        def show_menu(event):
            self.current_widget = event.widget
            self.context_menu.tk_popup(event.x_root, event.y_root)

        # Выбор клуба
        self.club_label = ctk.CTkLabel(self, text="Выберите Клуб:", font=ctk.CTkFont(size=14, weight="bold"))
        self.club_label.pack(anchor="w", padx=30, pady=(10, 0))
        
        self.combo_club = ctk.CTkComboBox(self, values=list(CLUBS.keys()), width=540, command=self.on_club_change, font=ctk.CTkFont(size=14))
        self.combo_club.pack(padx=30, pady=(5, 10))

        # API Key
        self.api_label = ctk.CTkLabel(self, text="1. Brawl Stars API Key (developer.brawlstars.com):", font=ctk.CTkFont(size=14, weight="bold"))
        self.api_label.pack(anchor="w", padx=30, pady=(10, 0))
        self.entry_api_key = ctk.CTkEntry(self, width=540, placeholder_text="Введите API ключ...")
        self.entry_api_key.pack(padx=30, pady=(5, 10))
        self.entry_api_key.bind("<Button-3>", show_menu)

        # Firebase Email
        self.email_label = ctk.CTkLabel(self, text="2. Email админа Firebase:", font=ctk.CTkFont(size=14, weight="bold"))
        self.email_label.pack(anchor="w", padx=30, pady=(10, 0))
        self.entry_fb_email = ctk.CTkEntry(self, width=540, placeholder_text="admin@brawl.com")
        self.entry_fb_email.pack(padx=30, pady=(5, 10))
        self.entry_fb_email.bind("<Button-3>", show_menu)

        # Firebase Password
        self.pass_label = ctk.CTkLabel(self, text="3. Пароль админа Firebase:", font=ctk.CTkFont(size=14, weight="bold"))
        self.pass_label.pack(anchor="w", padx=30, pady=(10, 0))
        self.entry_fb_pass = ctk.CTkEntry(self, width=540, show="*", placeholder_text="Пароль")
        self.entry_fb_pass.pack(padx=30, pady=(5, 10))
        self.entry_fb_pass.bind("<Button-3>", show_menu)

        # Инфо поля (только для чтения)
        self.tag_label = ctk.CTkLabel(self, text="Тег Клуба:", font=ctk.CTkFont(size=12), text_color="gray")
        self.tag_label.pack(anchor="w", padx=30, pady=(10, 0))
        self.entry_club_tag = ctk.CTkEntry(self, width=540, fg_color="transparent", text_color="gray")
        self.entry_club_tag.pack(padx=30, pady=(0, 5))

        self.fb_label = ctk.CTkLabel(self, text="База Firebase:", font=ctk.CTkFont(size=12), text_color="gray")
        self.fb_label.pack(anchor="w", padx=30, pady=(0, 0))
        self.entry_firebase_url = ctk.CTkEntry(self, width=540, fg_color="transparent", text_color="gray")
        self.entry_firebase_url.pack(padx=30, pady=(0, 10))

        # Кнопка
        self.btn_update = ctk.CTkButton(self, text="🚀 ПОЛНАЯ СИНХРОНИЗАЦИЯ", font=ctk.CTkFont(size=16, weight="bold"), height=50, fg_color="#4CAF50", hover_color="#45a049", command=self.on_update_click)
        self.btn_update.pack(padx=30, pady=(20, 10), fill="x")

        # Применяем данные первого клуба
        self.combo_club.set(list(CLUBS.keys())[0])
        self.on_club_change(list(CLUBS.keys())[0])

    def copy_text(self):
        if self.current_widget:
            try: self.current_widget.event_generate("<<Copy>>")
            except: pass
            
    def paste_text(self):
        if self.current_widget:
            try: self.current_widget.event_generate("<<Paste>>")
            except: pass
            
    def cut_text(self):
        if self.current_widget:
            try: self.current_widget.event_generate("<<Cut>>")
            except: pass

    def on_club_change(self, selected_club):
        # Сохраняем текущие введенные данные в config перед сменой
        if hasattr(self, 'current_club') and self.current_club in CLUBS:
            self.config_data[self.current_club] = {
                "api_key": self.entry_api_key.get().strip(),
                "fb_email": self.entry_fb_email.get().strip(),
                "fb_password": self.entry_fb_pass.get().strip()
            }
            save_config(self.config_data)

        self.current_club = selected_club

        if selected_club in CLUBS:
            # Обновляем статические поля
            self.entry_club_tag.configure(state="normal")
            self.entry_club_tag.delete(0, "end")
            self.entry_club_tag.insert(0, CLUBS[selected_club]["tag"])
            self.entry_club_tag.configure(state="readonly")
            
            self.entry_firebase_url.configure(state="normal")
            self.entry_firebase_url.delete(0, "end")
            self.entry_firebase_url.insert(0, CLUBS[selected_club]["firebase"])
            self.entry_firebase_url.configure(state="readonly")

            # Загружаем сохраненные данные для выбранного клуба
            club_data = self.config_data.get(selected_club, {})
            
            self.entry_api_key.delete(0, "end")
            self.entry_api_key.insert(0, club_data.get("api_key", ""))

            self.entry_fb_email.delete(0, "end")
            self.entry_fb_email.insert(0, club_data.get("fb_email", ""))

            self.entry_fb_pass.delete(0, "end")
            self.entry_fb_pass.insert(0, club_data.get("fb_password", ""))

    def on_update_click(self):
        selected_club = self.combo_club.get()
        api_key = self.entry_api_key.get().strip()
        club_tag = self.entry_club_tag.get().strip()
        firebase_url = self.entry_firebase_url.get().strip()
        fb_email = self.entry_fb_email.get().strip()
        fb_pass = self.entry_fb_pass.get().strip()
        web_api_key = CLUBS[selected_club]["web_api_key"]

        if not api_key or not club_tag or not firebase_url or not fb_email or not fb_pass:
            messagebox.showerror("Ошибка", "Заполните все поля, включая Email и Пароль администратора!")
            return

        # Сохраняем перед обновлением
        self.config_data[selected_club] = {
            "api_key": api_key,
            "fb_email": fb_email,
            "fb_password": fb_pass
        }
        save_config(self.config_data)
        
        self.btn_update.configure(state="disabled", text="⏳ ОБНОВЛЕНИЕ...")
        self.update()

        try:
            id_token = get_firebase_token(web_api_key, fb_email, fb_pass)
            bs_members = get_brawl_stars_members(api_key, club_tag)
            fb_data = get_firebase_data(firebase_url)
            
            role_map = {
                "president": "Президент",
                "vicePresident": "Вице-президент",
                "senior": "Ветеран",
                "member": "Участник"
            }
            
            fb_members = fb_data.get("members", [])
            old_fb_map = {m.get("name", ""): m for m in fb_members}
            
            new_fb_members = []
            added_count = 0
            updated_count = 0
            
            for i, bs_m in enumerate(bs_members):
                name = bs_m.get("name", "Unknown")
                new_trophies = bs_m.get("trophies", 0)
                raw_role = bs_m.get("role", "member")
                ru_role = role_map.get(raw_role, "Участник")
                
                if name in old_fb_map:
                    old_m = old_fb_map[name]
                    if old_m.get("trophies") != new_trophies or old_m.get("role") != ru_role:
                        updated_count += 1
                        
                    old_m["trophies"] = new_trophies
                    old_m["role"] = ru_role
                    new_fb_members.append(old_m)
                    del old_fb_map[name]
                else:
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
            self.btn_update.configure(state="normal", text="🚀 ПОЛНАЯ СИНХРОНИЗАЦИЯ")

if __name__ == "__main__":
    app = BrawlUpdaterApp()
    app.mainloop()
