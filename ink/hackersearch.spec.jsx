import * as React from 'react';
import {render, cleanup} from 'ink-testing-library';
import dedent from 'dedent-tabs';
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
		await sleep(10);
		expect(lastFrame()).toEqual(dedent`
			Search for the 5 latest Hackernews stories.
			Type your query and press Enter.

			 - result bangalore 1
			 - result bangalore 2
			 - result bangalore 3
			 - result bangalore 4
			 - result bangalore 5
			>_ █
		`);
		expect(searchMock).toHaveBeenNthCalledWith(1, 'bangalore');
		expect(searchMock).toHaveBeenCalledTimes(1);

		stdin.write('berlin');
		expect(lastFrame()).toEqual(dedent`
			Search for the 5 latest Hackernews stories.
			Type your query and press Enter.

			 - result bangalore 1
			 - result bangalore 2
			 - result bangalore 3
			 - result bangalore 4
			 - result bangalore 5
			>_ berlin█
			`);

		stdin.write(ENTER);
		await sleep(10);
		expect(lastFrame()).toEqual(dedent`
			Search for the 5 latest Hackernews stories.
			Type your query and press Enter.

			 - result berlin 1
			 - result berlin 2
			 - result berlin 3
			 - result berlin 4
			 - result berlin 5
			>_ █
		`);
		expect(searchMock).toHaveBeenNthCalledWith(2, 'berlin');
		expect(searchMock).toHaveBeenCalledTimes(2);
	});
});
