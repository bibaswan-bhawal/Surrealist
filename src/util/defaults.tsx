import { ConnectionOptions, SurrealistSession, SurrealistConfig } from "~/types";

export function createBaseConfig(): SurrealistConfig {
	return {
		theme: "automatic",
		tabs: [],
		environments: [],
		isPinned: false,
		activeTab: null,
		autoConnect: true,
		tableSuggest: true,
		wordWrap: true,
		queryHistory: [],
		queryFavorites: [],
		localDriver: "memory",
		localStorage: "",
		surrealPath: "",
		surrealUser: "root",
		surrealPass: "root",
		surrealPort: 8000,
		enableConsole: false,
		enableListing: false,
		queryTimeout: 10,
		updateChecker: true,
		queryListing: "history",
		resultListing: "json",
		fontZoomLevel: 1,
		errorChecking: true,
		lastPromptedVersion: null,
		tabSearch: false,
		defaultDesignerNodeMode: 'fields',
		defaultDesignerLayoutMode: 'diagram'
	};
}

export function createBaseConnection(): ConnectionOptions {
	return {
		endpoint: "",
		namespace: "",
		database: "",
		username: "",
		password: "",
		authMode: "root",
		scope: "",
		scopeFields: []
	};
}

export function createBaseSession(query?: string): SurrealistSession {
	return {
		id: "",
		name: "",
		environment: "",
		queries: [{ id: 1, text: query || '' }],
		activeQueryId: 1,
		lastQueryId: 1,
		variables: "{}",
		lastResponse: [],
		activeView: "query",
		connection: createBaseConnection(),
		pinned: false,
		pinnedTables: [],
		liveQueries: [],
	};
}