# Análise Assintótica: AES vs RSA

Este projeto mede o tempo de criptografia dos algoritmos **AES** e **RSA** conforme o
tamanho da mensagem de entrada cresce, e gera um gráfico comparando o crescimento
normalizado dos dois.

## Estrutura dos arquivos

| Arquivo | Linguagem | Função |
|---|---|---|
| `aes_adaptado.js` | JavaScript (Node.js) | Testa o tempo de criptografia do AES para mensagens de tamanhos crescentes e salva os resultados em `aes_resultados.csv` |
| `rsa_adaptado.js` | JavaScript (Node.js) | Testa o tempo de criptografia do RSA (dividindo a mensagem em blocos) para os mesmos tamanhos e salva os resultados em `rsa_resultados.csv` |
| `gerar_grafico.py` | Python | Lê os dois arquivos `.csv`, calcula a média de tempo por tamanho, normaliza os valores (0 a 1) e gera o gráfico comparativo `grafico_assintotico.png` |

## Pré-requisitos

Você precisa ter instalado na máquina:

- **Node.js** (versão 16 ou superior) — inclui o `npm`
- **Python** (versão 3.8 ou superior) — inclui o `pip`

Para verificar se já tem instalado, rode no terminal:

```bash
node -v
npm -v
python3 --version
pip3 --version
```

## 1. Instalando as dependências

### Dependências do Node.js (para os arquivos `.js`)

Na pasta do projeto, rode:

```bash
npm init -y
npm install crypto-js node-forge
```

Isso vai instalar:
- **crypto-js** — usada pelo `aes_adaptado.js` para realizar a criptografia AES
- **node-forge** — usada pelo `rsa_adaptado.js` para gerar as chaves e realizar a criptografia RSA

### Dependências do Python (para o `gerar_grafico.py`)

```bash
pip3 install pandas matplotlib --break-system-packages
```

> Se você estiver usando um ambiente virtual (`venv`), pode omitir a flag
> `--break-system-packages`:
> ```bash
> python3 -m venv venv
> source venv/bin/activate      # Linux/Mac
> venv\Scripts\activate         # Windows
> pip install pandas matplotlib
> ```

Isso vai instalar:
- **pandas** — usada para ler os arquivos `.csv` e calcular a média de tempo por tamanho de mensagem
- **matplotlib** — usada para gerar e salvar o gráfico

## 2. Rodando o projeto (ordem correta)

Os arquivos precisam ser rodados **nessa ordem**, pois o script Python depende dos
arquivos `.csv` gerados pelos scripts JavaScript.

### Passo 1 — Gerar os dados do AES

```bash
node ./adaptados/aes_adaptado.js
```

Isso cria (ou atualiza, via *append*) o arquivo `aes_resultados.csv` com o tempo de
criptografia para cada tamanho de mensagem testado.

> **Atenção:** como o script usa `fs.appendFileSync`, rodar esse comando mais de uma
> vez vai **adicionar** novas linhas ao CSV em vez de substituir. Se quiser refazer o
> teste do zero, apague o arquivo `aes_resultados.csv` antes de rodar novamente:
> ```bash
> rm aes_resultados.csv
> ```

### Passo 2 — Gerar os dados do RSA

```bash
node ./adaptados/rsa_adaptado.js
```

Isso cria (ou atualiza) o arquivo `rsa_resultados.csv` da mesma forma. Vale o mesmo
aviso sobre apagar o arquivo antes de rodar de novo, se quiser dados limpos:
```bash
rm rsa_resultados.csv
```

> Esse passo demora mais que o do AES, porque o RSA precisa gerar um par de chaves de
> 2048 bits e cifrar a mensagem em vários blocos pequenos (o RSA não consegue cifrar
> uma mensagem grande de uma vez só).

### Passo 3 — Gerar o gráfico comparativo

```bash
python3 gerar_grafico.py
```

Isso lê `aes_resultados.csv` e `rsa_resultados.csv`, calcula a média de tempo para
cada tamanho de mensagem, normaliza os dois conjuntos de dados numa escala de 0 a 1
(para facilitar a comparação visual do *formato* do crescimento, já que o RSA é bem
mais lento em termos absolutos) e salva o resultado em:

```
grafico_assintotico.png
```

## Resumo rápido (copiar e colar)

```bash
npm init -y
npm install crypto-js node-forge
pip3 install pandas matplotlib --break-system-packages

node aes_adaptado.js
node rsa_adaptado.js
python3 gerar_grafico.py
```

Ao final, o arquivo `grafico_assintotico.png` estará disponível na pasta do projeto.