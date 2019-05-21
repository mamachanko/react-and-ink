import querystring from 'querystring';
import got from 'got';
import {Box, StdinContext, Text} from 'ink';
import Spinner from 'ink-spinner';
import * as React from 'react';

const HackernewsAPI = {
	searchByDate: async query => {
		const url = `https://hn.algolia.com/api/v1/search_by_date?tags=story&query=${querystring.escape(query)}`;
		const {body} = await got(url);
		return JSON.parse(body)
			.hits
			.slice(0, 5)
			.map(hit => ({
				title: hit.title,
				id: hit.objectID
			}));
	}
};

export const Hackersearch = ({hackernewsAPI = HackernewsAPI}) => {
	const {stdin, setRawMode} = React.useContext(StdinContext);
	const [query, setQuery] = React.useState('');
	const [loading, setLoading] = React.useState(false);
	const [results, setResults] = React.useState([]);

	const keyListener = React.useMemo(() => async (_, key) => {
		if (key.name === 'return') {
			setLoading(true);
			setQuery('');
			setResults(await hackernewsAPI.searchByDate(query));
			setLoading(false);
		} else {
			setQuery(currentQuery => `${currentQuery}${key.sequence}`);
		}
	}, [hackernewsAPI, query]);

	React.useLayoutEffect(() => {
		setRawMode(true);
		stdin.on('keypress', keyListener);

		return () => {
			stdin.removeListener('keypress', keyListener);
			setRawMode(false);
		};
	}, [keyListener, setRawMode, stdin]);

	return (
		<Box flexDirection="column">
			<Box>Search for Hackernews stories by date.</Box>
			<Box>Type your query and press Enter.</Box>
			<Box marginLeft={2} marginY={1} flexDirection="column">
				{ loading ? <Loading/> : <Results results={results}/> }
			</Box>
			<Box>{`>_ ${query}█`}</Box>
		</Box>
	);
};

const Loading = () => (
	<Box>
		<Spinner type="dots"/> <Text>loading</Text>
	</Box>
);

const Results = ({results}) => (
	<Box flexDirection="column">
		{results.map((result, index) => {
			return <Box key={result.id}>{index + 1}. <Text bold>{result.title}</Text></Box>;
		})}
	</Box>
);
