
import getpass

from sqlalchemy.orm import Session

from database import engine
from models.user import User
from security import hash_password


def create_admin():
    name = input("Enter admin name: ").strip()
    email = input("Enter admin email: ").strip().lower()
    password = getpass.getpass("Create admin password (minimum 8 characters): ")

    if len(password) < 8:
        print("Password must be at least 8 characters.")
        return

    with Session(engine) as db:
        existing_user = db.query(User).filter(
            User.email == email
        ).first()

        if existing_user:
            print("This email is already registered.")
            print("No account was changed.")
            return

        admin = User(
            name=name,
            email=email,
            hashed_password=hash_password(password),
            role="admin",
            is_active=True
        )

        db.add(admin)
        db.commit()

        print("Admin account created successfully!")
        print("Email:", email)


if __name__ == "__main__":
    create_admin()

