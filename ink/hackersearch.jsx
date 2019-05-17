import * as React from 'react';
import {Box, Text, StdinContext} from 'ink';

export const Hackersearch = () => {
	const {stdin, setRawMode} = React.useContext(StdinContext);
	const [query, setQuery] = React.useState('');
	const [results, setResults] = React.useState([]);

	const keyListener = React.useMemo(() => (_, key) => {
		if (key.name === 'return') {
			setQuery('');
			setResults([
				'result 1',
				'result 2',
				'result 3',
				'result 4',
				'result 5'
			]);
		} else {
			setQuery(currentQuery => `${currentQuery}${key.sequence}`);
		}
	}, [setQuery]);

	// TODO: why useLayoutEffect and not useEffect ?
	React.useLayoutEffect(() => {
		// TODO: why the rawMode thing?
		setRawMode(true);
		stdin.on('keypress', keyListener);

		return () => {
			stdin.removeListener('keypress', keyListener);
			setRawMode(false);
		};
	}, [keyListener, setRawMode, stdin]);

	return (
		<Box flexDirection="column">
			<Text>Search for the 5 latest Hackernews stories.</Text>
			<Text>Type your query and press Enter.</Text>
			<Text>{' '}</Text>
			{results.map(result => <Text key={result}> - {result}</Text>)}
			<Text>{`>_ ${query}█`}</Text>
		</Box>
	);
};
