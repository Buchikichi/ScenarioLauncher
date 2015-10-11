package to.kit.scenario.launcher.controller;

import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.io.IOUtils;

import to.kit.sas.control.Controller;
import to.kit.scenario.launcher.dto.MapRequestDto;

/**
 * マップ関連制御.
 * @author Hidetaka Sasai
 */
public class MapController implements Controller<MapRequestDto> {
	@Override
	public Object execute(MapRequestDto form) {
		String wall = null;

		try (InputStream in = MapController.class.getResourceAsStream("/map100.wal")) {
			wall = IOUtils.toString(in);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return wall;
	}
}
