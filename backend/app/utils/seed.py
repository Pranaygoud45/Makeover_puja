from datetime import date, datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.appointment import Appointment, AppointmentStatus
from app.models.blog import BlogPost
from app.models.gallery import BeforeAfterImage, GalleryImage
from app.models.offer import Offer
from app.models.package import Package
from app.models.service import Service, ServiceCategory
from app.models.settings import BusinessSettings
from app.models.staff import StaffMember
from app.models.testimonial import Testimonial
from app.models.user import User, UserRole
from app.services.auth import hash_password


def seed_database(db: Session) -> None:
    admin = db.scalar(select(User).where(User.email == "admin@poojamakeover.com"))
    if admin is None:
        admin = User(
            email="admin@poojamakeover.com",
            hashed_password=hash_password("admin123"),
            full_name="Pooja Sharma",
            role=UserRole.super_admin,
            is_active=True,
        )
        db.add(admin)

    # Service Categories & Services
    if db.scalar(select(ServiceCategory).limit(1)) is None:
        bridal_cat = ServiceCategory(
            name="Bridal Makeup",
            slug="bridal-makeup",
            description="Signature HD, Airbrush, and Royal Bridal transformations.",
            sort_order=1,
            is_active=True,
        )
        hair_cat = ServiceCategory(
            name="Hair Styling & Care",
            slug="hair-styling",
            description="Precision cuts, coloring, keratin, and bridal hair artistry.",
            sort_order=2,
            is_active=True,
        )
        skin_cat = ServiceCategory(
            name="Skin & Facials",
            slug="skin-facials",
            description="Luminous hydra-facials, bridal glow rituals, and skincare treatments.",
            sort_order=3,
            is_active=True,
        )
        db.add_all([bridal_cat, hair_cat, skin_cat])
        db.flush()

        db.add_all(
            [
                Service(
                    category_id=bridal_cat.id,
                    name="Signature HD Bridal Makeup",
                    slug="signature-hd-bridal-makeup",
                    short_description="Flawless long-wear HD bridal look with draping & hairstyling.",
                    description="Complete bridal makeup with luxury skin prep, HD base, eyelashes, hairstyling, and saree/lehenga draping.",
                    price=18000,
                    duration="3 hours",
                    is_popular=True,
                    sort_order=1,
                ),
                Service(
                    category_id=bridal_cat.id,
                    name="Airbrush Royal Bridal",
                    slug="airbrush-royal-bridal",
                    short_description="Waterproof, weightless airbrush finish designed for all-day ceremonies.",
                    description="Ultra-fine airbrush application offering 18-hour longevity with custom bridal hair and jewelry setting.",
                    price=25000,
                    duration="3.5 hours",
                    is_popular=True,
                    sort_order=2,
                ),
                Service(
                    category_id=hair_cat.id,
                    name="Keratin Smooth & Shine",
                    slug="keratin-smooth-shine",
                    short_description="Frizz-free, silky hair restoration treatment.",
                    description="Deep nourishing keratin infusion that tames frizz and restores natural shine.",
                    price=4500,
                    duration="2 hours",
                    is_popular=False,
                    sort_order=1,
                ),
                Service(
                    category_id=skin_cat.id,
                    name="Pre-Bridal Hydra Glow Facial",
                    slug="pre-bridal-hydra-glow-facial",
                    short_description="Deep cleansing and hydration boost for radiant skin.",
                    description="Multi-step exfoliation, extraction, and serum infusion tailored for pre-bridal radiance.",
                    price=3500,
                    duration="75 mins",
                    is_popular=True,
                    sort_order=1,
                ),
            ]
        )

    # Packages
    if db.scalar(select(Package).limit(1)) is None:
        db.add_all(
            [
                Package(
                    name="Royal Bridal Suite",
                    slug="royal-bridal-suite",
                    category="bridal",
                    description="Our complete bridal luxury experience from pre-bridal glow to wedding day.",
                    features=[
                        "Airbrush Bridal Makeup",
                        "Pre-Bridal 3-Session Facial Ritual",
                        "Bridal Hair & Floral Styling",
                        "Saree / Lehenga Draping",
                        "Complimentary Touch-up Kit",
                    ],
                    price=35000,
                    is_popular=True,
                    sort_order=1,
                ),
                Package(
                    name="Party Glam Package",
                    slug="party-glam-package",
                    category="party-makeup",
                    description="Red-carpet ready makeup and styling for receptions and sangeet nights.",
                    features=[
                        "HD Party Makeup",
                        "Blowout or Soft Waves",
                        "Lash Extensions Included",
                        "Outfit Draping",
                    ],
                    price=6500,
                    is_popular=False,
                    sort_order=2,
                ),
            ]
        )

    # Gallery
    if db.scalar(select(GalleryImage).limit(1)) is None:
        db.add_all(
            [
                GalleryImage(
                    image_url="/images/gallery/bridal-1.jpg",
                    alt_text="Traditional Indian bridal makeup look",
                    category="bridal",
                    sort_order=1,
                ),
                GalleryImage(
                    image_url="/images/gallery/party-1.jpg",
                    alt_text="Evening party glam makeover",
                    category="party",
                    sort_order=2,
                ),
                GalleryImage(
                    image_url="/images/gallery/hair-1.jpg",
                    alt_text="Floral bridal bun hairstyle",
                    category="hairstyle",
                    sort_order=3,
                ),
            ]
        )
        db.add(
            BeforeAfterImage(
                before_image_url="/images/gallery/before-1.jpg",
                after_image_url="/images/gallery/after-1.jpg",
                title="Soft Glam Bridal Transformation",
                category="bridal",
            )
        )

    # Testimonials
    if db.scalar(select(Testimonial).limit(1)) is None:
        db.add_all(
            [
                Testimonial(
                    customer_name="Ananya Verma",
                    service="Signature HD Bridal Makeup",
                    feedback="Pooja made my wedding day truly unforgettable. My makeup stayed fresh for 14 hours and looked effortless in photos!",
                    rating=5,
                    is_approved=True,
                ),
                Testimonial(
                    customer_name="Riya Kapoor",
                    service="Party Glam Package",
                    feedback="Warm hospitality, spotless studio, and the exact soft-glam look I requested.",
                    rating=5,
                    is_approved=True,
                ),
            ]
        )

    # Blog posts
    if db.scalar(select(BlogPost).limit(1)) is None:
        db.add(
            BlogPost(
                title="30-Day Pre-Bridal Skincare Timeline for Radiant Wedding Glow",
                slug="30-day-pre-bridal-skincare-timeline",
                excerpt="A week-by-week skincare ritual to prepare your skin for flawless bridal makeup.",
                content="Start hydrating early, schedule your final hydra-facial 5 days before the wedding, and avoid trying new active acids during wedding week.",
                author="Pooja Sharma",
                published_at=datetime.now(timezone.utc),
                tags=["bridal", "skincare", "tips"],
                read_time=4,
                is_published=True,
            )
        )

    # Offers
    if db.scalar(select(Offer).limit(1)) is None:
        db.add(
            Offer(
                title="Bridal Season Early Bird Offer",
                description="Save 15% on Royal Bridal Suite bookings confirmed 60 days in advance.",
                valid_until=date.today() + timedelta(days=90),
                code="BRIDE15",
                is_active=True,
            )
        )

    # Staff
    if db.scalar(select(StaffMember).limit(1)) is None:
        db.add_all(
            [
                StaffMember(
                    name="Pooja Sharma",
                    role="Founder & Lead Makeup Artist",
                    specialization="Bridal & Airbrush Makeup",
                    bio="Over 10 years of artistry creating timeless Indian bridal and editorial looks.",
                    sort_order=1,
                ),
                StaffMember(
                    name="Meera Nair",
                    role="Senior Hair Stylist",
                    specialization="Bridal Buns & Color",
                    bio="Specialist in intricate bridal hair architecture and textured updos.",
                    sort_order=2,
                ),
            ]
        )

    # Business Settings
    default_settings = {
        "business_name": "Pooja Makeover",
        "tagline": "Your Beauty, Our Art.",
        "phone": "+91 98765 43210",
        "email": "hello@poojamakeover.com",
        "address": "12 Luxury Arcade, MG Road",
        "city": "New Delhi",
        "state": "Delhi",
        "pincode": "110001",
    }
    for key, value in default_settings.items():
        if db.scalar(select(BusinessSettings).where(BusinessSettings.key == key)) is None:
            db.add(BusinessSettings(key=key, value=value))

    # Sample appointment
    if db.scalar(select(Appointment).limit(1)) is None:
        db.add(
            Appointment(
                customer_name="Neha Gupta",
                mobile="9876543210",
                email="neha@example.com",
                service="Signature HD Bridal Makeup",
                preferred_date=date.today() + timedelta(days=7),
                preferred_time="10:00 AM",
                special_requirements="Bridal trial consultation",
                status=AppointmentStatus.pending,
            )
        )

    db.commit()


def main() -> None:
    with SessionLocal() as db:
        seed_database(db)
    print("Database seeded successfully.")


if __name__ == "__main__":
    main()
