import querystring from 'querystring';
import * as React from 'react';
import {Box, Text, StdinContext} from 'ink';
import {createLogger, format, transports} from 'winston';
import got from 'got';

const logger = createLogger({
	level: 'debug',
	format: format.combine(
		format.colorize(),
		format.simple()
	),
	transports: [
		new transports.File({filename: 'ink.log'})
	]
});

const getMostRecentHNStories = async query => {
	const url = `https://hn.algolia.com/api/v1/search_by_date?tags=story&query=${querystring.escape(query)}`;
	logger.info(`getting ${url}`);
	const {body} = await got(url);
	const results = JSON.parse(body).hits.slice(0, 5).map(hit => hit.title);
	logger.info(`result: ${results}`);
	return results;
};

export const Hackersearch = ({search = getMostRecentHNStories}) => {
	const {stdin, setRawMode} = React.useContext(StdinContext);
	const [query, setQuery] = React.useState('');
	const [results, setResults] = React.useState([]);

	const keyListener = React.useMemo(() => async (_, key) => {
		logger.info(`received keypress ${JSON.stringify(key)}`);
		if (key.name === 'return') {
			setQuery('');
			setResults(await search(query));
		} else {
			setQuery(currentQuery => `${currentQuery}${key.sequence}`);
		}
	}, [query, search]);

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
