import querystring from 'querystring';
import got from 'got';
import {Box, StdinContext, Text} from 'ink';
import Spinner from 'ink-spinner';
import * as React from 'react';
import {logger} from './log';

const HACKERNEWS_API_BASE_URL = process.argv[2] ? process.argv[2] : 'https://hn.algolia.com';

logger.info(`HACKERNEWS_API_BASE_URL: ${HACKERNEWS_API_BASE_URL}`);

const HackernewsAPI = {
	searchByDate: async query => {
		const searchByDateUrl = `${HACKERNEWS_API_BASE_URL}/api/v1/search_by_date?tags=story&query=${querystring.escape(query)}`;
		const {body} = await got(searchByDateUrl);
		return JSON.parse(body)
			.hits
			.slice(0, 5)
			.map(hit => ({
				title: hit.title,
				id: hit.objectID
			}));
	}
};

const initialState = {
	query: '',
	isLoading: false,
	results: []
};

const reducer = (state, action) => {
	switch (action.type) {
		case ('KEYSTROKE_RECEIVED'): {
			return {
				...state,
				query: `${state.query}${action.payload}`
			};
		}

		case ('RESULTS_LOADING'): {
			return {
				...state,
				isLoading: true,
				results: [],
				query: ''
			};
		}

		case ('RESULTS_RECEIVED'): {
			return {
				...state,
				isLoading: false,
				results: action.payload
			};
		}

		default:
			throw new Error(`unexpected action ${action}`);
	}
};

const useStdin = keyListener => {
	const {stdin, setRawMode} = React.useContext(StdinContext);

	React.useLayoutEffect(() => {
		setRawMode(true);
		stdin.on('keypress', keyListener);

		return () => {
			stdin.removeListener('keypress', keyListener);
			setRawMode(false);
		};
	}, [keyListener, setRawMode, stdin]);
};

export const Hackersearch = ({hackernewsAPI = HackernewsAPI}) => {
	const [
		{query, isLoading, results},
		dispatch
	] = React.useReducer(reducer, initialState);

	const keyListener = React.useMemo(() => async (_, key) => {
		if (key.name === 'return') {
			dispatch({type: 'RESULTS_LOADING'});
			const results = await hackernewsAPI.searchByDate(query);
			dispatch({type: 'RESULTS_RECEIVED', payload: results});
		} else {
			dispatch({type: 'KEYSTROKE_RECEIVED', payload: key.sequence});
		}
	}, [hackernewsAPI, query]);

	useStdin(keyListener);

	return (
		<Box flexDirection="column">
			<Box>Search for Hackernews stories by date.</Box>
			<Box>Type your query and press Enter.</Box>
			<Box marginLeft={2} marginY={1} flexDirection="column">
				{ isLoading ? <Loading/> : <Results results={results}/> }
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
