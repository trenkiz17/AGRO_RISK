import os
import requests


class ClimaService:

    URL_API = "https://api.openweathermap.org/data/2.5/weather"

    def __init__(self):
        self.api_key = os.getenv("OPENWEATHER_API_KEY")

    def executar(self, latitude, longitude):

        if self.api_key is None or self.api_key.strip() == "":
            raise ValueError(
                "Chave da API do OpenWeather não configurada."
            )

        if not -90 <= latitude <= 90:
            raise ValueError(
                "Latitude inválida. Deve estar entre -90 e 90."
            )

        if not -180 <= longitude <= 180:
            raise ValueError(
                "Longitude inválida. Deve estar entre -180 e 180."
            )

        parametros = {
            "lat": latitude,
            "lon": longitude,
            "appid": self.api_key,
            "units": "metric",
            "lang": "pt_br"
        }

        resposta = requests.get(
            self.URL_API,
            params=parametros,
            timeout=10
        )

        if resposta.status_code == 401:
            raise ValueError(
                "Chave da API do OpenWeather inválida ou ainda não ativada."
            )

        if resposta.status_code == 404:
            raise ValueError(
                "Não foi possível localizar os dados climáticos."
            )

        if resposta.status_code != 200:
            print(
                "OpenWeather respondeu:",
                resposta.status_code,
                resposta.text
            )

            raise Exception(
                "Erro retornado pela API do OpenWeather."
            )

        dados = resposta.json()

        clima = dados.get("weather", [{}])[0]
        dados_principais = dados.get("main", {})
        vento = dados.get("wind", {})
        nuvens = dados.get("clouds", {})
        chuva = dados.get("rain", {})

        resultado = {
            "cidade": dados.get("name"),
            "pais": dados.get("sys", {}).get("country"),

            "latitude": dados.get("coord", {}).get("lat"),
            "longitude": dados.get("coord", {}).get("lon"),

            "temperatura": dados_principais.get("temp"),
            "sensacao_termica": dados_principais.get("feels_like"),
            "temperatura_minima": dados_principais.get("temp_min"),
            "temperatura_maxima": dados_principais.get("temp_max"),

            "umidade": dados_principais.get("humidity"),
            "pressao": dados_principais.get("pressure"),

            "condicao": clima.get("main"),
            "descricao": clima.get("description"),
            "icone": clima.get("icon"),

            "vento_velocidade": vento.get("speed"),
            "vento_direcao": vento.get("deg"),

            "nebulosidade": nuvens.get("all"),

            "chuva_ultima_hora": chuva.get("1h", 0),

            "nascer_sol": dados.get("sys", {}).get("sunrise"),
            "por_sol": dados.get("sys", {}).get("sunset"),

            "timezone": dados.get("timezone")
        }

        return resultado