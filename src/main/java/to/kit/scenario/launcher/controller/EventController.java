package to.kit.scenario.launcher.controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import net.arnx.jsonic.JSON;
import to.kit.sas.control.Controller;
import to.kit.scenario.launcher.dto.EventRequest;
import to.kit.scenario.launcher.dto.Scenario;
import to.kit.scenario.launcher.dto.Scenario.ScenarioFunction;

/**
 * マップ関連資材.
 * @author Hidetaka Sasai
 */
public class EventController implements Controller<EventRequest> {
	private static final String SCENARIO_FILE = "/scene.json";
	private static Scenario scenario;

	private void loadScenario() {
		if (scenario != null) {
			return;
		}
		try (InputStream in = EventController.class.getResourceAsStream(SCENARIO_FILE)) {
			scenario = JSON.decode(in, Scenario.class);
		} catch (@SuppressWarnings("unused") IOException e) {
			// nop
		}
	}

	@Override
	public Object execute(EventRequest form) {
		String eventId = form.getEventId();

		loadScenario();
		if (StringUtils.isBlank(eventId)) {
			eventId = scenario.getFirstEvent();
		}
		Map<String, ScenarioFunction> functionMap = scenario.getFunctionMap();
		ScenarioFunction result = functionMap.get(eventId);

		return result;
	}
}
