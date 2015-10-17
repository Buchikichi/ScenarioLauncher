package to.kit.scenario.launcher.dto;

import java.io.Serializable;

/**
 * イベントリクエスト.
 * @author Hidetaka Sasai
 */
public final class EventRequest implements Serializable {
	private String eventId;

	/**
	 * イベントIDを取得.
	 * @return イベントID
	 */
	public String getEventId() {
		return this.eventId;
	}
	/**
	 * イベントIDを設定.
	 * @param value イベントID
	 */
	public void setEventId(String value) {
		this.eventId = value;
	}
}
