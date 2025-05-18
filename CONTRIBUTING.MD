## 🎯 Objetivo
Desenvolver um aplicativo móvel multiplataforma (Android/iOS) que permita aos usuários converter valores entre diferentes moedas em tempo real, utilizando dados atualizados de uma API de câmbio.

## 🚀 Passos para Desenvolvimento

 Como baixar o Projeto Ionic:

1- Bash (ou CMD):

1.1 - Abra uma pasta em sua máquina e dentro dela abra o Bash (ou CMD). Pré-requisito para clonar o repositório é ter o Git instalado, para verificar digite o seguinte comando no CMD:

    git --version

1.2 - Após verificar, ainda no CMD, digitamos os seguintes comandos

    git init
    git clone https://github.com/Mariiaclaracm/IonicConverterAPI.git
    cd .\IonicConverterAPI

1.3 - Para rodar o projeto é necessário o seguinte comando:

    ionic serve

  Ao rodar será aberta uma url **http://localhost:8100** onde você pode acessar-la dando Ctrl+click na url em seu terminal ou copiando diretamente em seu navegador de preferência.

## 📱 Pré-Requisitos

1- Ambiente de Desenvolvimento:
  1.1- Node.js instalado
  
  1.2- Ionic/Cli instalado globalmente:

    npm install -g @ionic/cli


2- Ferramentas e Bibliotecas:
  2.1 Framework: Ionic (com angular)
  
  2.2 Linguagem: TypeScript
  
  2.3 Gerenciador de pacotes: npm
  
  2.4 API de Conversão de moedas:
    -(A decidir (ExchangeRate API ou CurrencyConverterAPI))
  
  2.5 Armazenamento Local:
    -(A decidir (Local Storage ou SQLite (com Ionic Native))

## 🤝 Como Contribuir
Faça um fork do repositório

Crie uma nova branch:

    git checkout -b minha-feature

Faça suas alterações.

Commit suas mudanças:

    git commit -m "feat: adiciona nova funcionalidade de conversão"

Envie para o seu fork:

    git push origin minha-feature

Crie um Pull Request explicando as mudanças feitas.