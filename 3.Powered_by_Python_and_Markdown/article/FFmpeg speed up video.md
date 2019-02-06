Speed up and smaller:

`ffmpeg -i input.mp4 -filter_complex "[0:v]setpts=0.5*PTS[v];[0:a]atempo=2.0[a]" -map "[v]" -map "[a]" output.mp4`


Speed up and bigger:

`ffmpeg -i in.mp4 -vf "setpts=0.5*PTS" -r 50 -c:v mpeg4 -b:v 1500k -af "atempo=2" out.mp4`


