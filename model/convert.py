import tensorflowjs as tfjs
from tensorflow import keras
import shutil
import os


def convert():
    model_path = "./model.h5"
    model = keras.models.load_model(model_path)
    model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])
    if os.path.isdir("../web/server/converted_model/"):
        shutil.rmtree("../web/server/converted_model/")
    os.makedirs("../web/server/converted_model/")
    tfjs.converters.save_keras_model(model, "../web/server/converted_model/")


if __name__ == "__main__":
    convert()
