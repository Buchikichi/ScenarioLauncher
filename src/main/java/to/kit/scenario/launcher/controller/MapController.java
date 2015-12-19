package to.kit.scenario.launcher.controller;

import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.io.IOUtils;

import to.kit.sas.control.Controller;
import to.kit.scenario.launcher.dto.MapRequestDto;

/**
 * マップ関連資材.
 * @author Hidetaka Sasai
 */
public class MapController implements Controller<MapRequestDto> {
	/**
	 * イメージをロード.
	 * @param name リソース名
	 * @return イメージ
	 */
	private byte[] loadImage(final String name) {
		byte[] image = null;

		try (InputStream in = MapController.class.getResourceAsStream(name)) {
			image = IOUtils.toByteArray(in);
		} catch (@SuppressWarnings("unused") IOException e) {
			// nop
		}
		return image;
	}

	/**
	 * セルイメージを取得.
	 * @param path パス
	 * @return セルイメージ
	 */
	public byte[] cell(String path) {
		String name = "/" + path + ".png";

		return loadImage(name);
	}

	/**
	 * 上層部イメージを取得.
	 * @param path パス
	 * @return 上層部イメージ
	 */
	public byte[] upstairs(String path) {
		String name = "/" + path + "st.png";

		return loadImage(name);
	}

	/**
	 * バックグラウンドイメージを取得.
	 * @param path パス
	 * @return バックグラウンドイメージ
	 */
	public byte[] background(String path) {
		String name = "/" + path + "bg.png";

		return loadImage(name);
	}

	@Override
	public Object execute(MapRequestDto form) {
		String wall = null;
		String name = "/" + form.getMapId() + ".map";

		try (InputStream in = MapController.class.getResourceAsStream(name)) {
			if (in != null) {
				wall = IOUtils.toString(in);
			}
		} catch (@SuppressWarnings("unused") IOException e) {
			// nop
		}
		return wall;
	}
}
