export type MessageData = {
  is_on: boolean;
  is_dimmable: boolean;
  brightness?: number;
};

export type DeviceData = {
  device_id: string;
  status: MessageData;
};
