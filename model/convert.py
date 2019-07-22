import tensorflowjs as tfjs
from tensorflow import keras
import shutil
import os


def convert():
    model_folder = "./h5s/"
    model_filename = "balanced_convolutional-2L-maxpooling.h5"
    model_type = model_filename.split("_")[0]
    mapping_path = "./emnist_mappings/emnist-" + model_type + "-mapping.txt"

    model = keras.models.load_model(model_folder + model_filename)
    if os.path.isdir("../web/server/converted_model/"):
        shutil.rmtree("../web/server/converted_model/")
    os.makedirs("../web/server/converted_model/")
    tfjs.converters.save_keras_model(model, "../web/server/converted_model/")

    mapping = {}
    with open(mapping_path, "r", newline="") as mapping_file:
        for line in mapping_file.readlines():
            key = int(line.split(" ")[0])
            val = chr(int(line.split(" ")[1]))
            mapping[key] = val
    metadata = mapping
    from json import dumps

    with open("../web/server/converted_model/metadata.json", "w+") as metadata_file:
        metadata_file.write(dumps(metadata, indent=4))


if __name__ == "__main__":
    convert()
