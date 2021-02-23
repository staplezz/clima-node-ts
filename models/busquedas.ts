import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import Lugar from "./lugar";
import fs from "fs";

export default class Busquedas {

	historial: string[] = [];
	dbPath = './db/database.json';

	constructor() {
		this.leerDB();
	}

	get paramsMapBox(): AxiosRequestConfig["params"] {
		return {
			'access_token': process.env.MAPBOX_KEY || '',
			'limit': 5,
			'language': 'es'
		}
	}

	get historialCapitalizado(): string[] {
		const wordRegex = /(^\w{1})|(\s+\w{1})/g;

		this.historial.forEach((v, i) => {
			this.historial[i] = v.replace(wordRegex, letter => letter.toLocaleUpperCase())
		});

		return this.historial;
	}

	paramsOpenWeather(lugar: Lugar): AxiosRequestConfig["params"] {
		return {
			'appid': process.env.OPENWM_KEY || '',
			'lat': lugar.lat,
			'lon': lugar.lng,
			'lang': 'es',
			'units': 'metric'
		}
	}

	async ciudad(lugar: string): Promise<AxiosResponse> {
		// Configuración de axios.
		const axiosConfig : AxiosRequestConfig = {
			baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places`,
			params: this.paramsMapBox
		}

		// Instancia de axios con su configuración.
		const instance = axios.create(axiosConfig);

		// Realizamos la petición a mapbox.
		const resp = await instance.get(`/${lugar}.json`);
		return resp;
	}

	creaListaLugares(resp: AxiosResponse): Array<Lugar> {
		const lugares: Array<Lugar> = [];

		for(const l of resp.data.features) {
			// Creamos el objeto de tipo lugar.
			const lugar: Lugar = new Lugar(
				l.id,
				l.place_name,
				l.center[0],
				l.center[1]
			)

			// Agregamos a la lista de lugares.
			lugares.push(lugar);
		}

		return lugares;
	}

	async getTemperatura(lugar: Lugar): Promise<AxiosResponse> {
		// Configuración de axios.
		const axiosConfig : AxiosRequestConfig = {
			baseURL: 'https://api.openweathermap.org/data/2.5',
			params: this.paramsOpenWeather(lugar)
		}

		// Instancia de axios con su configuración.
		const instance = axios.create(axiosConfig);

		// Realizamos la petición a openWeatherMap.
		const resp = await instance.get('/weather');

		return resp;
	}

	completaInfoLugar(lugar: Lugar, resp: AxiosResponse): void {
		lugar.temp = resp.data.main.temp;
		lugar.min = resp.data.main.temp_min;
		lugar.max = resp.data.main.temp_max;
		lugar.desc = resp.data.weather[0].description;
	}

	agregarHistorial (lugar: string): void {
		// Prevenir duplicados.
		if (this.historial.includes(lugar.toLocaleLowerCase())) return;

		this.historial = this.historial.splice(0,5);
		this.historial.unshift(lugar.toLocaleLowerCase());

		// Guardar en BD.
		this.guardarDB();
	}

	guardarDB(): void {
		const payload = {
			historial: this.historial
		};

		fs.writeFileSync(this.dbPath, JSON.stringify( payload ));
	}

	leerDB(): void {
		let data = {
			historial: ['']
		};

		// Debe de existir archivo.
		if(fs.existsSync(this.dbPath)) {
			// Leémos archivo.
			const info: string = fs.readFileSync(this.dbPath, { encoding: 'utf-8'});
			// Parse a json.
			data = JSON.parse(info);
		}

		// Agregamos al historial.
		data.historial.forEach(v => {
			this.historial.push(v);
		})
	}
}
