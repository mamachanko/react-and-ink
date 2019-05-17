import * as React from 'react';
import {render, cleanup} from 'ink-testing-library';
import dedent from 'dedent-tabs';
import {Hackersearch} from './hackersearch.jsx';

const ENTER = '\r';

describe('Hackersearch', () => {
	afterEach(cleanup);

	it('I can query for the 5 most-recent matching stories on Hackernews', () => {
		const {lastFrame, stdin} = render(<Hackersearch/>);

		expect(lastFrame()).toEqual(dedent`
			Search for the 5 latest Hackernews stories.
			Type your query and press Enter.

			>_ █
		`);

		stdin.write('Bangalore');
		expect(lastFrame()).toEqual(dedent`
			Search for the 5 latest Hackernews stories.
			Type your query and press Enter.

			>_ Bangalore█
		`);

		stdin.write(ENTER);
		expect(lastFrame()).toEqual(dedent`
			Search for the 5 latest Hackernews stories.
			Type your query and press Enter.

			 - result 1
			 - result 2
			 - result 3
			 - result 4
			 - result 5
			>_ █
		`);
	});
});
