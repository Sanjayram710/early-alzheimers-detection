import pytest
from backend.auth.security import hash_password, verify_password, create_access_token, decode_access_token


def test_password_hashing():
    raw_pass = "securepassword123"
    hashed = hash_password(raw_pass)

    assert hashed != raw_pass
    assert verify_password(raw_pass, hashed) is True
    assert verify_password("wrongpass", hashed) is False


def test_jwt_token_encode_decode():
    payload = {"sub": "user-12345", "role": "admin"}
    token = create_access_token(payload)

    assert isinstance(token, str)
    decoded = decode_access_token(token)

    assert decoded.user_id == "user-12345"
    assert decoded.role == "admin"
