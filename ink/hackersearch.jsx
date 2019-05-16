import * as React from 'react';
import {render, Box} from 'ink';

export const Hackersearch = () => (
	<Box>
		{`Search for the 5 latest Hackernews stories.
Type your query and press <enter>.

>_`}
	</Box>
);

render(<Hackersearch/>);
