package to.kit.scenario.launcher.controller;

import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.io.IOUtils;

import to.kit.sas.control.Controller;
import to.kit.scenario.launcher.dto.Scenario;

/**
 * アイテム関連資材.
 * @author Hidetaka Sasai
 */
public class ItemController implements Controller<Object> {
	/**
	 * イメージを取得.
	 * @param path パス
	 * @return バックグラウンドイメージ
	 */
	public byte[] image(String path) {
		byte[] image = null;
		String name = "/" + path + ".png";

		try (InputStream in = ActorController.class.getResourceAsStream(name)) {
			image = IOUtils.toByteArray(in);
		} catch (@SuppressWarnings("unused") IOException e) {
			// nop
		}
		return image;
	}

	@Override
	public Object execute(Object form) {
		Scenario scenario = EventController.loadScenario();

		return scenario.getItemList();
	}
}
