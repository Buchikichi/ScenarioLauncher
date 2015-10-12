package to.kit.scenario.launcher.controller;

import java.awt.image.RenderedImage;
import java.io.IOException;
import java.io.InputStream;

import javax.imageio.ImageIO;

import org.apache.commons.io.IOUtils;

import to.kit.sas.control.Controller;
import to.kit.scenario.launcher.dto.MapRequestDto;

/**
 * マップ関連資材.
 * @author Hidetaka Sasai
 */
public class MapController implements Controller<MapRequestDto> {
	/**
	 * 上層部イメージを取得.
	 * @param path パス
	 * @return 上層部イメージ
	 */
	public RenderedImage upstairs(String path) {
		RenderedImage image = null;
		String name = "/" + path + "st.png";

		try (InputStream in = MapController.class.getResourceAsStream(name)) {
			image = ImageIO.read(in);
		} catch (@SuppressWarnings("unused") IOException e) {
			// nop
		}
		return image;
	}

	/**
	 * バックグラウンドイメージを取得.
	 * @param path パス
	 * @return バックグラウンドイメージ
	 */
	public RenderedImage background(String path) {
		RenderedImage image = null;
		String name = "/" + path + "bg.png";

		try (InputStream in = MapController.class.getResourceAsStream(name)) {
			image = ImageIO.read(in);
		} catch (@SuppressWarnings("unused") IOException e) {
			// nop
		}
		return image;
	}

	@Override
	public Object execute(MapRequestDto form) {
		String wall = null;
		String name = "/" + form.getMapId() + ".map";

		try (InputStream in = MapController.class.getResourceAsStream(name)) {
			wall = IOUtils.toString(in);
		} catch (@SuppressWarnings("unused") IOException e) {
			// nop
		}
		return wall;
	}
}
