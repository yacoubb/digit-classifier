def train(mode, dataset):
    from tensorflow import keras
    from emnist import list_datasets, extract_training_samples, extract_test_samples
    import numpy as np
    from numpy.random import seed
    from tensorflow import set_random_seed

    name = mode[0]
    mode = mode[1]
    seed(4)
    set_random_seed(4)

    (train_images, train_labels) = extract_training_samples(dataset)
    (test_images, test_labels) = extract_test_samples(dataset)
    train_labels = keras.utils.to_categorical(train_labels)
    test_labels = keras.utils.to_categorical(test_labels)

    if mode["reshape"]:
        # Reshaping the array to 4-dims so that it can work with the Keras API
        # The last number is 1, which signifies that the images are greyscale.
        train_images = np.reshape(train_images, (train_images.shape[0], 28, 28, 1))
        test_images = np.reshape(test_images, (test_images.shape[0], 28, 28, 1))

    train_images = keras.utils.normalize(train_images, axis=1)
    test_images = keras.utils.normalize(test_images, axis=1)

    model = keras.Sequential()
    for l in mode["architecture"]:
        model.add(l)

    es = keras.callbacks.EarlyStopping(monitor="val_loss", mode="min", patience=2)
    model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])
    print(model.summary())
    model.fit(x=train_images, y=train_labels, epochs=100, validation_split=0.1, callbacks=[es])
    model_name = dataset + "_" + name
    model.save("./" + model_name + ".h5")
    print("saved model to " + model_name + ".h5")

    print("evaluating...")
    val_loss, val_acc = model.evaluate(x=test_images, y=test_labels)

    del train_images
    del train_labels
    del test_images
    del test_labels

    import gc

    gc.collect()


def get_model_types(dataset):
    from tensorflow import keras
    from emnist import extract_training_samples

    (train_images, train_labels) = extract_training_samples(dataset)
    train_labels = keras.utils.to_categorical(train_labels)
    num_categories = train_labels.shape[1]
    #     num_categories = len(set(train_labels))

    model_types = [
        (
            "convolutional-1L",
            {
                "reshape": True,
                "architecture": [
                    keras.layers.Conv2D(32, kernel_size=3, activation="relu", input_shape=(28, 28, 1)),
                    keras.layers.Flatten(),
                    keras.layers.Dense(128, activation="relu"),
                    keras.layers.Dense(num_categories, activation="softmax"),
                ],
            },
        ),
        (
            "convolutional-1L-maxpooling",
            {
                "reshape": True,
                "architecture": [
                    keras.layers.Conv2D(28, kernel_size=(3, 3), input_shape=(28, 28, 1)),
                    keras.layers.MaxPooling2D(pool_size=(2, 2)),
                    keras.layers.Flatten(),  # Flattening the 2D arrays for fully connected layers
                    keras.layers.Dense(128, activation="relu"),
                    keras.layers.Dropout(0.2),
                    keras.layers.Dense(num_categories, activation="softmax"),
                ],
            },
        ),
        (
            "convolutional-2L-maxpooling",
            {
                "reshape": True,
                "architecture": [
                    keras.layers.Conv2D(32, kernel_size=(3, 3), activation="relu", input_shape=(28, 28, 1)),
                    keras.layers.Conv2D(64, (3, 3), activation="relu"),
                    keras.layers.MaxPooling2D(pool_size=(2, 2)),
                    keras.layers.Dropout(0.25),
                    keras.layers.Flatten(),
                    keras.layers.Dense(128, activation="relu"),
                    keras.layers.Dropout(0.5),
                    keras.layers.Dense(num_categories, activation="softmax"),
                ],
            },
        ),
        (
            "dense_dropout",
            {
                "reshape": False,
                "architecture": [
                    keras.layers.Flatten(input_shape=(28, 28)),
                    keras.layers.Dense(128, activation="relu"),
                    keras.layers.Dropout(0.2),
                    keras.layers.Dense(num_categories, activation="softmax"),
                ],
            },
        ),
    ]
    del train_images
    del train_labels
    return model_types


def train_all(dataset):
    model_types = get_model_types(dataset)

    print("=" * 100)
    print("starting training on " + dataset + " emnist dataset")
    for mt in model_types:
        print("=" * 100)
        print(mt[0])
        train(mt, dataset)
        print(mt[0])
