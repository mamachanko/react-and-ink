import * as React from 'react';
import {render, cleanup} from 'ink-testing-library';
import dedent from 'dedent-tabs';
import chalk from 'chalk';
import {Hackersearch} from './hackersearch.jsx';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms || 0));
const ENTER = '\r';

describe('Hackersearch', () => {
	afterEach(cleanup);

	it('I can query for the 5 most-recent matching stories on Hackernews', async () => {
		const searchMock = jest.fn()
			.mockResolvedValueOnce([
				'result bangalore 1',
				'result bangalore 2',
				'result bangalore 3',
				'result bangalore 4',
				'result bangalore 5'
			])
			.mockResolvedValueOnce([
				'result berlin 1',
				'result berlin 2',
				'result berlin 3',
				'result berlin 4',
				'result berlin 5'
			]);

		const {lastFrame, stdin} = render(<Hackersearch search={searchMock}/>);

		expect(lastFrame()).toEqual(dedent`
			Search for the 5 latest Hackernews stories.
			Type your query and press Enter.


			>_ █
		`);

		stdin.write('bangalore');
		expect(lastFrame()).toEqual(dedent`
			Search for the 5 latest Hackernews stories.
			Type your query and press Enter.


			>_ bangalore█
		`);

		stdin.write(ENTER);
		expect(lastFrame()).toEqual(dedent`
			Search for the 5 latest Hackernews stories.
			Type your query and press Enter.

			  ⠋ loading

			>_ █
		`);
		await sleep(10);
		expect(lastFrame()).toEqual(dedent`
			Search for the 5 latest Hackernews stories.
			Type your query and press Enter.

			  1. ${chalk.bold('result bangalore 1')}
			  2. ${chalk.bold('result bangalore 2')}
			  3. ${chalk.bold('result bangalore 3')}
			  4. ${chalk.bold('result bangalore 4')}
			  5. ${chalk.bold('result bangalore 5')}

			>_ █
		`);
		expect(searchMock).toHaveBeenNthCalledWith(1, 'bangalore');
		expect(searchMock).toHaveBeenCalledTimes(1);

		stdin.write('berlin');
		expect(lastFrame()).toEqual(dedent`
			Search for the 5 latest Hackernews stories.
			Type your query and press Enter.

			  1. ${chalk.bold('result bangalore 1')}
			  2. ${chalk.bold('result bangalore 2')}
			  3. ${chalk.bold('result bangalore 3')}
			  4. ${chalk.bold('result bangalore 4')}
			  5. ${chalk.bold('result bangalore 5')}

			>_ berlin█
			`);

		stdin.write(ENTER);
		expect(lastFrame()).toEqual(dedent`
			Search for the 5 latest Hackernews stories.
			Type your query and press Enter.

			  ⠋ loading

			>_ █
		`);
		await sleep(10);
		expect(lastFrame()).toEqual(dedent`
			Search for the 5 latest Hackernews stories.
			Type your query and press Enter.

			  1. ${chalk.bold('result berlin 1')}
			  2. ${chalk.bold('result berlin 2')}
			  3. ${chalk.bold('result berlin 3')}
			  4. ${chalk.bold('result berlin 4')}
			  5. ${chalk.bold('result berlin 5')}

			>_ █
		`);
		expect(searchMock).toHaveBeenNthCalledWith(2, 'berlin');
		expect(searchMock).toHaveBeenCalledTimes(2);
	});
});
