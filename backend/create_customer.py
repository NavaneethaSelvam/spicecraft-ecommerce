
import getpass

from sqlalchemy.orm import Session

from database import engine
from models.user import User
from security import hash_password


def create_customer():
    name = input("Enter customer name: ").strip()
    email = input("Enter customer email: ").strip().lower()
    password = getpass.getpass(
        "Create customer password (minimum 8 characters): "
    )

    if not name:
        print("Customer name is required.")
        return

    if len(password) < 8:
        print("Password must be at least 8 characters.")
        return

    with Session(engine) as db:
        existing_user = db.query(User).filter(
            User.email == email
        ).first()

        if existing_user:
            print("This email is already registered.")
            return

        customer = User(
            name=name,
            email=email,
            hashed_password=hash_password(password),
            role="customer",
            is_active=True
        )

        db.add(customer)
        db.commit()

        print("Customer account created successfully!")
        print("Email:", email)


if __name__ == "__main__":
    create_customer()