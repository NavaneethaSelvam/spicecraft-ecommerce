print("Customer check started")

from database import SessionLocal
from models.user import User

db = SessionLocal()

try:
    user = db.query(User).filter(
        User.email == "customer@test.com"
    ).first()

    if user:
        print("Customer found!")
        print("Name:", user.name)
        print("Email:", user.email)
        print("Role:", user.role)
        print("Active:", user.is_active)
        print("Password hash exists:", bool(user.hashed_password))
    else:
        print("Customer account not found!")

except Exception as e:
    print("Error:", e)

finally:
    db.close()

print("Customer check finished")