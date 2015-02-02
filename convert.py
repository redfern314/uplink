import os

with open("audio.raw", "rb") as fin:
    with open("audio.h","w") as fout:
        byte = fin.read(1)
        fout.write("unsigned char audio_raw[] = {\n")
        numbytes = 0
        while byte != "":
            numbytes += 1
            bytestr = format(ord(byte),"02x")
            fout.write("0x"+str(bytestr)+", ")

            if (numbytes % 10) == 0:
                # numbytes = 0
                fout.write("\n")
            byte = fin.read(1)

            if (numbytes >= 400000):
                break

        if (numbytes % 10) == 0:
            fout.seek(-3,os.SEEK_CUR)
        else:
            fout.seek(-2,os.SEEK_CUR)

        fout.truncate()

        fout.write("\n}\n\nunsigned int audio_raw_len = " + str(numbytes) + ";")

        fin.close()
        fout.close()