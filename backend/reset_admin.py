from getpass import getpass
from sqlalchemy.orm import Session
from database import engine
from models.user import User
from security import hash_password

email = input("Admin email: ").strip().lower()
password = getpass("Enter new admin password: ")

if len(password) < 8:
    print("Password must be at least 8 characters.")
else:
    with Session(engine) as db:
        user = db.query(User).filter(User.email == email).first()

        if user is None:
            print("Admin account not found.")
        elif user.role != "admin":
            print("This account is not an admin.")
        else:
            user.hashed_password = hash_password(password)
            user.is_active = True
            db.commit()
            print("Admin password updated successfully!")