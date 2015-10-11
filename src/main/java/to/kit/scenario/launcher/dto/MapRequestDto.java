package to.kit.scenario.launcher.dto;

import java.io.Serializable;

public class MapRequestDto implements Serializable {
	private String mapId;

	public String getMapId() {
		return this.mapId;
	}
	public void setMapId(String value) {
		this.mapId = value;
	}
}
