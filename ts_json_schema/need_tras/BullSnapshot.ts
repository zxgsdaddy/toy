
export type BullSnapshot = {
  snapshot: BullDeskTopic.Snapshot;
};

export namespace BullDeskTopic {
  export type FightItem = DeskTopic.FightItem & {
      is_have_bull: boolean;
  };
  export type Snapshot = {
    stage: 'NONE' | 'RAISE' | 'FIGHT' | 'SETTLE';
    user_info: {
        [pos: number]: DeskTopic.UserItem;
    };
    raise: {
        [pos: number]: DeskTopic.RaiseItem;
    };
    fight: {
        [pos: number]: DeskTopic.FightItem;
    };
    settle: {
        [pos: number]: DeskTopic.SettleItem;
  };};
}


export namespace DeskTopic {
  export type UserItem = {
      user_id: string;
      username: string;
      avatar?: string;
      balance: number;
      position: number;
  };

  export type DisputeItem = {
      is_banker: boolean;
      dispute_rate: number;
      is_done: boolean;
  };

  export type RaiseItem = {
      raise_rate: number;
      is_done: boolean;
  };

  export type FightItem = {
      cards: number[];
      type: string;
      odds: number;
      is_done: boolean;
  };

  export type SettleItem = {
      surplus: number;
  };
}
