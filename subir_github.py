#!/usr/bin/env python3
"""
Script auxiliar para publicação do projeto no GitHub.
Oferece suporte a:
1. Criação automática de repositório privado via Personal Access Token (PAT).
2. Configuração de repositório remoto existente com autenticação via navegador (Git Credential Manager).
"""

import json
import os
from pathlib import Path
import subprocess
import sys
import urllib.error
import urllib.request

DIR_RAIZ = Path(__file__).resolve().parent
USUARIO_PADRAO = "joaovictorsaraujo"
NOME_REPO_PADRAO = "maquina-estatistica"


def executar_comando(cmd: list) -> subprocess.CompletedProcess:
    """Executa um comando localmente no diretório do projeto."""
    return subprocess.run(cmd, cwd=str(DIR_RAIZ), capture_output=True, text=True)


def criar_repo_via_token(token: str, nome_repo: str = NOME_REPO_PADRAO) -> bool:
    """Cria repositório privado no GitHub utilizando a API REST com Token (PAT)."""
    url = "https://api.github.com/user/repos"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "User-Agent": "MaquinaEstatistica-Uploader",
    }
    payload = {
        "name": nome_repo,
        "description": "Máquina Estatística — Trabalho I de Probabilidade e Estatística I (IFES Serra)",
        "private": True,
        "auto_init": False,
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST",
    )

    try:
        with urllib.request.urlopen(req) as resp:
            print(f"[OK] Repositório privado '{nome_repo}' criado com sucesso no GitHub!")
            return True
    except urllib.error.HTTPError as e:
        corpo = e.read().decode("utf-8")
        if e.code == 422:
            print(f"[!] Repositório '{nome_repo}' já existe na sua conta. Prosseguindo com o envio...")
            return True
        print(f"[ERRO] Falha ao criar repositório na API do GitHub (HTTP {e.code}):")
        print(corpo)
        return False


def configurar_e_fazer_push(url_remoto: str) -> bool:
    """Configura o remote origin e realiza o push da branch master."""
    # Remove origin antigo se existir
    executar_comando(["git", "remote", "remove", "origin"])

    # Adiciona origin
    add_res = executar_comando(["git", "remote", "add", "origin", url_remoto])
    if add_res.returncode != 0:
        print("[ERRO] Falha ao adicionar remote origin:", add_res.stderr)
        return False

    print(f"Enviando branch 'master' para {url_remoto}...")
    # Executa git push de forma interativa para permitir que o Git Credential Manager abra o navegador se necessário
    res_push = subprocess.run(["git", "push", "-u", "origin", "master"], cwd=str(DIR_RAIZ))
    return res_push.returncode == 0


def main():
    print("=" * 65)
    print("      PUBLICADOR DE REPOSITÓRIO GITHUB — MÁQUINA ESTATÍSTICA")
    print("=" * 65)
    print("O GitHub descontinuou autenticação por senha de conta em 2021.")
    print("Para enviar o projeto, escolha uma das opções abaixo:\n")
    print("1. Tenho um Personal Access Token (PAT) do GitHub")
    print("   (Cria o repositório privado automaticamente e envia os commits)")
    print("2. Já criei o repositório privado manualmente pelo site do GitHub")
    print("   (Conecta o repositório e faz o push autenticando pelo navegador)")
    print("0. Cancelar")
    print("-" * 65)

    opcao = input("Escolha uma opção [0-2]: ").strip()

    if opcao == "1":
        token = input("\nCole seu Personal Access Token (PAT): ").strip()
        if not token:
            print("[!] Token vazio. Operação cancelada.")
            return

        nome_repo = input(f"Nome do repositório privado [{NOME_REPO_PADRAO}]: ").strip() or NOME_REPO_PADRAO
        if criar_repo_via_token(token, nome_repo):
            url_autenticada = f"https://{token}@github.com/{USUARIO_PADRAO}/{nome_repo}.git"
            sucesso = configurar_e_fazer_push(url_autenticada)
            # Remove o token da URL remota para segurança
            executar_comando(["git", "remote", "set-url", "origin", f"https://github.com/{USUARIO_PADRAO}/{nome_repo}.git"])
            if sucesso:
                print(f"\n[SUCESSO] Projeto enviado para https://github.com/{USUARIO_PADRAO}/{nome_repo}")
            else:
                print("\n[!] Houve uma falha durante o git push.")

    elif opcao == "2":
        nome_repo = input(f"Informe o nome do repositório criado no GitHub [{NOME_REPO_PADRAO}]: ").strip() or NOME_REPO_PADRAO
        url_repo = f"https://github.com/{USUARIO_PADRAO}/{nome_repo}.git"
        sucesso = configurar_e_fazer_push(url_repo)
        if sucesso:
            print(f"\n[SUCESSO] Projeto enviado para {url_repo}")
        else:
            print("\n[!] O envio não foi concluído. Verifique o login no navegador e permissões.")
    else:
        print("\nOperação cancelada.")


if __name__ == "__main__":
    main()
