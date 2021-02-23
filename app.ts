import 'dotenv/config';
import {Answers} from "inquirer";

import {inquirerPausa,
		inquirerMenu,
		leerInput,
		listarLugares} from './helpers/inquirer';
import Busquedas from './models/busquedas';
import Lugar from './models/lugar'

async function main(): Promise<void> {
	// Variables para las opciones del usuario.
	let opt: Answers;
	let optNum = -1;

	const busquedas: Busquedas = new Busquedas();
	
	do {
		// Esperamos una respuesta del usuario.
		opt = await inquirerMenu();
		// Obtenemos la opción que seleccionó.
		optNum = opt.opcion;

		switch (optNum) {
			case 1: {
				const lugar: Answers = await leerInput('Ciudad: ');
				const lugarNombre: string = (lugar.desc as string);

				const lugaresResponse = await busquedas.ciudad(lugarNombre);


				const listaLugares: Array<Lugar> = busquedas.creaListaLugares(lugaresResponse);

				if (listaLugares.length === 0) {
					console.log("No encontré ninguna ciudad, por favor realiza la búsqueda de nuevo.");
					break;
				}

				const idLugarSelec = await listarLugares(listaLugares);
				const lugarSelec = listaLugares.find(l => l.id === idLugarSelec);

				if (lugarSelec) {			
					// Obtenemos información del clima.
					const weatherResponse = await busquedas.getTemperatura(lugarSelec);

					// Asignamos la información obtenida.
					busquedas.completaInfoLugar(lugarSelec, weatherResponse);

					// Mostramos información al usuario.
					lugarSelec.mostrarInformacionConsola();

					// Guardar en .json
					busquedas.agregarHistorial(lugarSelec.nombre);
				} else {
					console.log("No encontré ninguna ciudad, por favor realiza la búsqueda de nuevo.");
					break;
				}
				break;

			}

			case 2: {
				busquedas.historialCapitalizado.forEach((lugar, i) => {
					const idx = `${i+1}.`.green;
					console.log(`${idx} ${lugar}`);
				});

				
			}
			
		}

		// Pausa para el usuario.
		if (optNum !== 0) await inquirerPausa();

	} while(optNum !== 0);
}

main();