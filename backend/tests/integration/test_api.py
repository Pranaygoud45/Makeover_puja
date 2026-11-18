from datetime import date


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_auth_login_me_and_register(client, admin_user, admin_headers, staff_headers):
    # Invalid login
    bad = client.post("/api/v1/auth/login", json={"email": "admin@poojamakeover.com", "password": "wrong"})
    assert bad.status_code == 401

    # Valid login
    res = client.post("/api/v1/auth/login", json={"email": "admin@poojamakeover.com", "password": "admin123"})
    assert res.status_code == 200
    body = res.json()
    assert body["token_type"] == "bearer"
    assert body["user"]["email"] == "admin@poojamakeover.com"

    # /auth/me
    me = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {body['access_token']}"})
    assert me.status_code == 200
    assert me.json()["full_name"] == "Pooja Admin"

    # Staff cannot register users
    forbidden = client.post(
        "/api/v1/auth/register",
        json={"email": "new@poojamakeover.com", "password": "password123", "full_name": "New User"},
        headers=staff_headers,
    )
    assert forbidden.status_code == 403

    # Admin can register users
    created = client.post(
        "/api/v1/auth/register",
        json={"email": "new@poojamakeover.com", "password": "password123", "full_name": "New User", "role": "staff"},
        headers=admin_headers,
    )
    assert created.status_code == 201
    assert created.json()["email"] == "new@poojamakeover.com"


def test_appointments_public_create_and_admin_workflow(client, admin_headers):
    # Invalid mobile returns 422
    invalid = client.post(
        "/api/v1/appointments",
        json={
            "customer_name": "Priya",
            "mobile": "999",
            "service": "Bridal Makeup",
            "preferred_date": str(date.today()),
            "preferred_time": "10:00 AM",
        },
    )
    assert invalid.status_code == 422

    # Valid public creation
    created = client.post(
        "/api/v1/appointments",
        json={
            "customer_name": "Priya Mehta",
            "mobile": "9876543210",
            "email": "priya@example.com",
            "service": "Bridal Makeup",
            "preferred_date": str(date.today()),
            "preferred_time": "10:00 AM",
            "special_requirements": "Subtle glam",
        },
    )
    assert created.status_code == 201
    appt = created.json()
    assert appt["status"] == "pending"
    appt_id = appt["id"]

    # Unauthenticated list fails
    assert client.get("/api/v1/appointments").status_code == 401

    # Admin list
    listed = client.get("/api/v1/appointments?page=1&page_size=10", headers=admin_headers)
    assert listed.status_code == 200
    assert listed.json()["total"] == 1

    # Admin status update
    patched = client.patch(
        f"/api/v1/appointments/{appt_id}/status",
        json={"status": "confirmed"},
        headers=admin_headers,
    )
    assert patched.status_code == 200
    assert patched.json()["status"] == "confirmed"

    # Customers aggregation & dashboard endpoints
    customers = client.get("/api/v1/customers", headers=admin_headers)
    assert customers.status_code == 200
    assert customers.json()["total"] == 1
    assert customers.json()["items"][0]["booking_count"] == 1

    stats = client.get("/api/v1/dashboard/stats", headers=admin_headers)
    assert stats.status_code == 200
    assert stats.json()["appointments"]["by_status"]["confirmed"] == 1

    reports = client.get("/api/v1/dashboard/reports", headers=admin_headers)
    assert reports.status_code == 200
    assert reports.json()["summary"]["total_appointments"] == 1

    # Delete appointment
    deleted = client.delete(f"/api/v1/appointments/{appt_id}", headers=admin_headers)
    assert deleted.status_code == 200


def test_services_crud_and_settings(client, admin_headers):
    # Create category (admin)
    cat_res = client.post(
        "/api/v1/services/categories",
        json={"name": "Bridal Makeup", "slug": "bridal-makeup", "description": "Bridal looks"},
        headers=admin_headers,
    )
    assert cat_res.status_code == 201
    cat_id = cat_res.json()["id"]

    # Create service (admin)
    svc_res = client.post(
        "/api/v1/services",
        json={
            "category_id": cat_id,
            "name": "HD Bridal",
            "slug": "hd-bridal",
            "short_description": "HD bridal makeup",
            "price": "15000.00",
            "duration": "3 hours",
            "is_popular": True,
        },
        headers=admin_headers,
    )
    assert svc_res.status_code == 201
    svc_id = svc_res.json()["id"]

    # Public read category by slug includes service
    public_cat = client.get("/api/v1/services/categories/bridal-makeup")
    assert public_cat.status_code == 200
    assert len(public_cat.json()["services"]) == 1

    # Update service
    upd_res = client.put(
        f"/api/v1/services/{svc_id}",
        json={"name": "Royal HD Bridal"},
        headers=admin_headers,
    )
    assert upd_res.status_code == 200
    assert upd_res.json()["name"] == "Royal HD Bridal"

    # Settings PUT (admin) & GET (public)
    put_settings = client.put(
        "/api/v1/settings",
        json={"settings": {"business_name": "Pooja Makeover", "phone": "+91 98765 43210"}},
        headers=admin_headers,
    )
    assert put_settings.status_code == 200
    assert client.get("/api/v1/settings").json()["business_name"] == "Pooja Makeover"

    # Delete service and category
    assert client.delete(f"/api/v1/services/{svc_id}", headers=admin_headers).status_code == 200
    assert client.delete(f"/api/v1/services/categories/{cat_id}", headers=admin_headers).status_code == 200


def test_content_endpoints_and_seed(client, db_session, admin_headers):
    from app.utils.seed import seed_database

    seed_database(db_session)
    # Re-running seed should be idempotent
    seed_database(db_session)

    # Public reads of seeded data
    assert client.get("/api/v1/services/categories").json()["total"] == 3
    assert client.get("/api/v1/packages").json()["total"] == 2
    assert client.get("/api/v1/gallery").json()["total"] == 3
    assert client.get("/api/v1/gallery/before-after").json()["total"] == 1
    assert client.get("/api/v1/testimonials").json()["total"] == 2
    assert client.get("/api/v1/blog").json()["total"] == 1
    assert client.get("/api/v1/offers").json()["total"] == 1
    assert client.get("/api/v1/staff").json()["total"] == 2

    # Unapproved testimonial hidden from public, visible to admin
    t_res = client.post(
        "/api/v1/testimonials",
        json={"customer_name": "Draft Reviewer", "feedback": "Pending", "rating": 4, "is_approved": False},
        headers=admin_headers,
    )
    assert t_res.status_code == 201
    assert client.get("/api/v1/testimonials").json()["total"] == 2
    assert client.get("/api/v1/testimonials/admin", headers=admin_headers).json()["total"] == 3

    # Unpublished blog post hidden from public, visible to admin
    b_res = client.post(
        "/api/v1/blog",
        json={"title": "Draft Post", "slug": "draft-post", "is_published": False},
        headers=admin_headers,
    )
    assert b_res.status_code == 201
    assert client.get("/api/v1/blog/draft-post").status_code == 404
    assert client.get("/api/v1/blog/admin", headers=admin_headers).json()["total"] == 2

