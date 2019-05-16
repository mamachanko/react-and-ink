import * as React from 'react';
import {render} from 'ink-testing-library';
import {Hackersearch} from './hackersearch.jsx';

describe('Hackersearch', () => {
	it('shows search results', () => {
		const {lastFrame} = render(<Hackersearch/>);

		expect(lastFrame()).toEqual(`Search for the 5 latest Hackernews stories.
Type your query and press <enter>.

>_`);
	});
});
