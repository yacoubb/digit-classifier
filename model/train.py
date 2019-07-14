from tensorflow import keras
from emnist import list_datasets, extract_training_samples, extract_test_samples


def main():
    print(list_datasets())
    (train_images, train_labels) = extract_training_samples("bymerge")
    (test_images, test_labels) = extract_test_samples("bymerge")

    # (train_images, train_labels), (test_images, test_labels) = keras.datasets.mnist.load_data()
    print(train_images.shape, train_labels.shape)
    print(test_images.shape, test_labels.shape)

    train_images = keras.utils.normalize(train_images, axis=1)
    test_images = keras.utils.normalize(test_images, axis=1)

    model = keras.Sequential()
    model.add(keras.layers.Conv2D(28, kernel_size=(3, 3), input_shape=(28, 28)))
    model.add(keras.layers.MaxPooling2D(pool_size=(2, 2)))
    model.add(keras.layers.Flatten())  # Flattening the 2D arrays for fully connected layers
    model.add(keras.layers.Dense(128, activation="relu"))
    model.add(keras.layers.Dropout(0.2))
    model.add(keras.layers.Dense(len(set(train_labels)), activation="softmax"))

    # We use sparse_categorical_crossentropy since the labels are numbers 0-9 rather than one-hot encoded vectors
    model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])
    model.fit(x=train_images, y=train_labels, epochs=10)
    model.save("./model.h5")
    print("saved model to model.h5")

    print("evaluating...")
    val_loss, val_acc = model.evaluate(x=test_images, y=test_labels)


if __name__ == "__main__":
    main()
