import { editor } from "monaco-editor";
import { mdiClose, mdiDatabase, mdiPlus, mdiUpload } from "@mdi/js";
import { useStable } from "~/hooks/stable";
import { useActiveSession } from "~/hooks/environment";
import { actions, store, useStoreValue } from "~/store";
import { Panel } from "~/components/Panel";
import { useRef } from "react";
import { configureQueryEditor, updateQueryValidation } from "~/util/editor";
import { useDebouncedCallback } from "~/hooks/debounce";
import { SurrealistEditor } from "~/components/SurrealistEditor";
import { ActionIcon, Group, ScrollArea, Tabs } from "@mantine/core";
import { Icon } from "~/components/Icon";
import { adapter } from "~/adapter";
import { SURQL_FILTERS } from "~/constants";

export function QueryPane() {
	const { queries, activeQueryId } = useActiveSession();
	const controls = useRef<editor.IStandaloneCodeEditor>();
	const fontZoomLevel = useStoreValue((state) => state.config.fontZoomLevel);

	const showTabs = queries.length > 1;
	const queryIndex = queries.findIndex(({ id }) => id === activeQueryId);
	const queryInfo = queries[queryIndex];
	const queryText = queryInfo?.text || "";

	const setQueryForced = useStable((content: string | undefined) => {
		store.dispatch(actions.updateQueryTab({
			text: content || ""
		}));

		updateQueryValidation(controls.current!);
	});

	const scheduleSetQuery = useDebouncedCallback(200, setQueryForced);

	const configure = useStable((editor: editor.IStandaloneCodeEditor) => {
		configureQueryEditor(editor);
		updateQueryValidation(editor);

		controls.current = editor;
	});

	const handleUpload = useStable(async () => {
		const query = await adapter.openFile('Load query from file', SURQL_FILTERS, false);

		if (typeof query == 'string') {
			setQueryForced(query);
		}
	});

	const removeTab = useStable((tab: number) => {
		store.dispatch(actions.removeQueryTab(tab));
	});

	const appendTab = useStable(() => {
		store.dispatch(actions.addQueryTab());
	});

	const handleTabChange = useStable((value: string | null) => {
		if (value) {
			const tabId = Number.parseInt(value);

			store.dispatch(actions.setActiveQueryTab(tabId));
		}
	});

	return (
		<Panel
			title="Query"
			icon={mdiDatabase}
			rightSection={
				<Group>
					<ActionIcon onClick={appendTab} title="New query tab">
						<Icon color="light.4" path={mdiPlus} />
					</ActionIcon>

					<ActionIcon onClick={handleUpload} title="Load from file">
						<Icon color="light.4" path={mdiUpload} />
					</ActionIcon>
				</Group>
			}
		>
			{showTabs && (
				<Tabs
					mt={-4}
					value={activeQueryId.toString()}
					onTabChange={handleTabChange}
				>
					<ScrollArea
						pb="xs"
					>
						<Tabs.List
							style={{ flexWrap: "nowrap" }}
						>
							{queries.map(({ id }) => (
								<Tabs.Tab
									py={8}
									px={10}
									key={id}
									value={id.toString()}
								>
									<Group spacing="xs" noWrap>
										Query #{id}
										{id > 1 && (
											<ActionIcon
												size="xs"
												component="div"
												onClick={(e) => {
													e.stopPropagation();
													removeTab(id);
												}}
											>
												<Icon path={mdiClose} color="gray.6" />
											</ActionIcon>
										)}
									</Group>
								</Tabs.Tab>
							))}
						</Tabs.List>
					</ScrollArea>
				</Tabs>
			)}

			<SurrealistEditor
				noExpand
				language="surrealql"
				onMount={configure}
				value={queryText}
				onChange={scheduleSetQuery}
				style={{
					position: "absolute",
					insetInline: 24,
					top: showTabs ? 50 : 0,
					bottom: 0
				}}
				options={{
					quickSuggestions: false,
					wordBasedSuggestions: false,
					wrappingStrategy: "advanced",
					wordWrap: "on",
					fontSize: 14 * fontZoomLevel,
				}}
			/>
		</Panel>
	);
}
