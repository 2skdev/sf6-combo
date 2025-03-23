from pprint import pprint
import click
import json

import firebase_admin
from firebase_admin import auth, credentials

SERVICE_ACCOUNT_PATH = "./firebase.sa.json"

cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
firebase_admin.initialize_app(cred)


@click.group()
def main():
    pass


@main.command()
@click.argument("uid")
def get(uid):
    user = auth.get_user(uid)
    claims = user.custom_claims
    pprint(claims)


@main.command()
@click.argument("uid")
@click.option("-c", "--claims", required=True)
def set(uid, claims):
    claims = json.loads(claims)
    auth.set_custom_user_claims(uid, claims)
    user = auth.get_user(uid)
    claims = user.custom_claims
    pprint(claims)


if __name__ == "__main__":
    main()
