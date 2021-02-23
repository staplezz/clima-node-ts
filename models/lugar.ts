export default class Lugar {
	desc: string;
	min: number;
	max: number;
	temp: number;

	
	constructor(
		public id: string,
		public nombre: string,
		public lng: string,
		public lat: string,
		) {
		this.id = id;
		this.nombre = nombre;
		this.lng = lng;
		this.lat = lat;
		this.desc = "";
		this.min = -1;
		this.max = -1;
		this.temp = -1;
	}

	mostrarInformacionConsola(): void {
		console.clear();
		console.log('Información de la ciudad\n'.green);
		console.log('Ciudad:', this.nombre);
		console.log('Lat:', this.lat);
		console.log('Long:', this.lng);
		console.log('Descripción:', this.desc);
		console.log('Temperatura:', this.temp, '°C');
		console.log('Temperatura mínima:', this.min, '°C');
		console.log('Temperatura máxima:', this.max, '°C');
	}
}
