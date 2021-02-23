import {prompt, QuestionCollection, Answers, ChoiceOptions} from "inquirer";
import colors from "colors";
import Lugar from "../models/lugar"

// Habilitamos colores.
colors.enable();

// Para pausa del menú.
export async function inquirerPausa(): Promise<void> {
	const pausaInput : QuestionCollection = [
		{
			type: 'input',
			name: 'pausa',
			message: `Presione ${'ENTER'.green} para continuar.`,
		}
	]

	await prompt(pausaInput);
}

//Menú de inquirer.
export async function inquirerMenu(): Promise<Answers>{
	const choices = [
		{
			value: 1,
			name: `${'1'.red}. Buscar ciudad`
		},
		{
			value: 2,
			name: `${'2'.red}. Historial`
		},
		{
			value: 0,
			name: `${'0'.white}. Salir`
		}
	];

	const preguntasMenu : QuestionCollection = [
		{
			type: 'list',
			name: 'opcion',
			message: '¿Qué desea hacer?',
			choices
		}
	];

	console.clear();
	console.log('======================='.blue);
	console.log('App para obtener el clima');
	console.log('~~~~~~~~~~~~~~~~~~~~~~~'.blue);
	console.log(' Seleccione una opción');
	console.log('======================='.green);

	return await prompt(preguntasMenu);
}

// Lee input del usuario.
export async function leerInput(message: string): Promise<Answers> {
	const leerInput : QuestionCollection = [
		{
			type: 'input',
			name: 'desc',
			message,
			validate( value: string ) {
				if (value.length === 0) {
					return 'Por favor ingrese un valor';
				}
				return true;
			}
		}
	]

	return await prompt(leerInput);
}

export async function listarLugares(lugares: Array<Lugar>): Promise<string> {
	// Arreglo de choices de lugares.
	const choices: Array<ChoiceOptions> = lugares.map((lugar: Lugar, i) => {
		const idx = `${i + 1}`.green;

		return {
			value: lugar.id,
			name: `${idx} ${lugar.nombre}`
		}
	});
	
	choices.push( {
		value: '0',
		name: `${'0'.green} Cancelar.`
	});

	const preguntas: QuestionCollection = {
		type: 'list',
		name: 'id',
		message: 'Seleccione',
		choices
	}

	// return await prompt(preguntas);
	const { id } = await prompt(preguntas);
	return id;
}
