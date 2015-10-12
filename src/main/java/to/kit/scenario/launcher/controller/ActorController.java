package to.kit.scenario.launcher.controller;

import java.awt.image.RenderedImage;
import java.io.IOException;
import java.io.InputStream;

import javax.imageio.ImageIO;

import to.kit.sas.control.Controller;

/**
 * キャラクター資材.
 * @author Hidetaka Sasai
 */
public class ActorController implements Controller<Object> {
	/**
	 * イメージを取得.
	 * @param path パス
	 * @return バックグラウンドイメージ
	 */
	public RenderedImage image(String path) {
		RenderedImage image = null;
		String name = "/" + path + ".png";

		try (InputStream in = ActorController.class.getResourceAsStream(name)) {
			image = ImageIO.read(in);
		} catch (@SuppressWarnings("unused") IOException e) {
			// nop
		}
		return image;
	}

	@Override
	public Object execute(Object form) {
		return null;
	}
}
