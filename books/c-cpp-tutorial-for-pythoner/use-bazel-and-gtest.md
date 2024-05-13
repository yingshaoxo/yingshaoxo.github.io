# Use Bazel and Gtest

## Why Bazel?

Because `cmake` or `make` is too hard to learn.

## How to learn Bazel?

Follow its instruction on official website: 

{% embed url="https://docs.bazel.build/versions/master/tutorial/cpp.html" %}

The `binary BUILD file` may looks like this:

```text
cc_binary(
    name = "hello-world",
    srcs = ["hello-world.cc"],
    visibility = ["//visibility:public"]
)
```

The `library BUILD file` may looks like this:

```text
cc_library(
    name = "hello-lib",
    srcs = ["hello-lib.cc"],
    hdrs = ["hello-lib.h"],
    visibility = ["//visibility:public"]
)
```

## How to use Gtest with Bazel?

{% embed url="https://docs.bazel.build/versions/master/cpp-use-cases.html\#including-external-libraries" %}

The final folder structure may looks like this:

```text
├── external
│   └── gtest.BUILD
├── lib
│   ├── BUILD
│   ├── hello-lib.cc
│   └── hello-lib.h
├── main
│   ├── BUILD
│   └── hello-world.cc
├── test
│   ├── BUILD
│   └── hello-test.cc
└── WORKSPACE
```

## A real example

{% embed url="https://github.com/yingshaoxo/imagination" %}



