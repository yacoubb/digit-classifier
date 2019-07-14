from tensorflow import keras

(train_images, train_labels), (test_images, test_labels) = keras.datasets.mnist.load_data()

train_images = keras.utils.normalize(train_images, axis=1)
test_images = keras.utils.normalize(test_images, axis=1)

model = keras.Sequential()
model.add(keras.layers.Flatten())
model.add(keras.layers.Dense(128, activation="relu"))
model.add(keras.layers.Dense(128, activation="relu"))
model.add(keras.layers.Dense(10, activation="softmax"))

# We use sparse_categorical_crossentropy since the labels are numbers 0-9 rather than one-hot encoded vectors
model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])
model.fit(x=train_images, y=train_labels, epochs=4)
model.save("./model.h5")
print("saved model to model.h5")

print("evaluating...")
val_loss, val_acc = model.evaluate(x=test_images, y=test_labels)
