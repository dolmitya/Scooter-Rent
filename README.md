# 🛴 Веб-приложение для аренды самокатов

Современное веб-приложение для аренды самокатов с разделением прав доступа: **пользователь** и **админ**. Реализована гибкая система управления самокатами, поездками и финансами. Для удобства добавлена интеграция с картами — можно видеть самокаты в реальном времени.

## 🚀 Возможности

### 👤 Пользователь
- Регистрация и вход
- Аренда и завершение поездок
- Просмотр истории поездок
- Пополнение баланса
- Отображение самокатов на карте с их статусами и ценами

### 🛠️ Админ
- Добавление новых самокатов
- Обновление информации и цен
- Управление парком самокатов

## 🔐 Авторизация

Используется **JWT-аутентификация**, токен сохраняется в **кеше браузера**, что позволяет:
- не выходить из аккаунта при перезапуске приложения;
- сразу перейти на нужную страницу, минуя регистрацию и авторизацию.

## ⚙️ Технологии

- Java 21 + Spring Boot 3
- Spring Security + JWT
- PostgreSQL + Flyway
- Docker
- JPA (Hibernate)
- Apache Maven
- API карт (визуализация самокатов)

## 📸 Демонстрация

### Пользователь:
![user1](https://github.com/user-attachments/assets/ab12ed7e-cd95-4d0a-aed8-ae98c2021c7b)  
![user2](https://github.com/user-attachments/assets/b33f989b-bb21-448c-b13f-e57edb80ba8b)  
![user3](https://github.com/user-attachments/assets/8b53c614-e168-4ca9-8dc8-8202013564c3)  
![user4](https://github.com/user-attachments/assets/1ba14e69-f9ea-49fc-a9ee-515dac5e1d84)  
![user5](https://github.com/user-attachments/assets/290fe957-fa9c-41c7-8d73-d7b21e58807f)  
![user6](https://github.com/user-attachments/assets/f6064f54-9997-4894-9e2d-0387e4e85fa1)  
![user7](https://github.com/user-attachments/assets/48d7e298-db01-4af5-b5f7-ad0048e72224)  
![user8](https://github.com/user-attachments/assets/1fee1819-fc01-453b-a9dd-f2a7c99ec24f)  
![user9](https://github.com/user-attachments/assets/91b6a1e8-b44c-43aa-b478-ccf1300260ef)  

### Админ:
![admin1](https://github.com/user-attachments/assets/b9125b04-0031-4bab-8505-ebd49645ada6)  
![admin2](https://github.com/user-attachments/assets/e5be20af-ec14-4794-b5b9-a94259cfd482)  
![admin3](https://github.com/user-attachments/assets/d02327cb-4081-476e-aa27-632c01197782)  
![admin4](https://github.com/user-attachments/assets/93edab7f-6f12-4882-b68b-972f8f1d7855)  
