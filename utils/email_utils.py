import os
import random
import string
import smtplib
from email.mime.text import MIMEText

def gerar_senha_temporaria(tamanho=8):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=tamanho))

def enviar_email(destinatario, assunto, corpo):
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = int(os.getenv("SMTP_PORT"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    msg = MIMEText(corpo)
    msg["Subject"] = assunto
    msg["From"] = smtp_user
    msg["To"] = destinatario
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, destinatario, msg.as_string())