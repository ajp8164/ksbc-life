import { log } from '@react-native-ajp-elements/core';

const firestoreSubscriptions: {
  subscription: () => void;
  who: string;
}[] = [];

export const addFirestoreSubscription = (
  subscription: () => void,
  who: string,
) => {
  firestoreSubscriptions.push({ subscription, who });
  log.debug(
    `Added firestore subscription ${who}, subscriptions count=${firestoreSubscriptions.length}`,
  );
};

export const cancelAllFirestoreSubscriptions = () => {
  for (let i = 0; i < firestoreSubscriptions.length; i++) {
    const item = firestoreSubscriptions[i];
    if (item?.subscription) {
      item.subscription();
      log.debug(`Canceled firestore subscription: ${item.who} `);
    }
  }
  firestoreSubscriptions.length = 0; // Clear the array
};
