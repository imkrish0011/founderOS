
# FounderOS Curriculum

# Phase V — Deep Learning

> Goal: Understand, build, train, debug, and optimize neural networks using PyTorch, progressing from perceptrons to modern deep architectures.

**Estimated Duration:** 12–16 Weeks  
**Difficulty:** ⭐⭐⭐⭐☆

---

# Prerequisites

- Python
- Machine Learning
- Linear Algebra
- Calculus
- Probability
- NumPy

---

# Module 1 — Neural Network Fundamentals

## Learn
- Biological vs Artificial Neurons
- Perceptron
- Multi-Layer Perceptron (MLP)
- Forward Propagation
- Activation Functions
  - Sigmoid
  - Tanh
  - ReLU
  - Leaky ReLU
  - GELU (overview)
- Loss Functions
- Backpropagation
- Gradient Descent

### Resources
- 3Blue1Brown — Neural Networks
- DeepLearning.AI — Neural Networks and Deep Learning
- PyTorch Documentation

### Project
Implement a neural network from scratch using NumPy.

---

# Module 2 — PyTorch Essentials

## Learn
- Tensors
- Autograd
- Datasets & DataLoaders
- nn.Module
- Optimizers
- GPU Training
- Saving & Loading Models

### Practice
- MNIST Digit Classification
- Fashion-MNIST Classification

---

# Module 3 — Training Deep Networks

## Learn
- Batch Training
- Epochs
- Mini-batches
- Learning Rate Scheduling
- Weight Initialization
- Regularization
- Dropout
- Batch Normalization
- Early Stopping

### Project
Train an image classifier with validation and checkpoints.

---

# Module 4 — Convolutional Neural Networks

## Learn
- Convolution
- Padding
- Stride
- Pooling
- Feature Maps
- CNN Architectures
  - LeNet
  - AlexNet
  - VGG
  - ResNet (intro)

### Resources
- Stanford CS231n
- PyTorch Tutorials

### Projects
- Cats vs Dogs Classifier
- CIFAR-10 Image Classifier

---

# Module 5 — Sequence Models

## Learn
- RNN
- LSTM
- GRU
- Sequence Prediction
- Time Series Basics

### Project
Predict stock or weather sequences.

---

# Module 6 — Optimization

## Learn
- SGD
- Momentum
- RMSProp
- Adam
- Learning Rate Schedulers

### Experiment
Compare optimizer performance on the same dataset.

---

# Module 7 — Model Evaluation

## Learn
- Accuracy
- Precision
- Recall
- F1 Score
- ROC-AUC
- Confusion Matrix
- TensorBoard
- Experiment Tracking

---

# Essential Libraries

- PyTorch
- torchvision
- NumPy
- pandas
- matplotlib

---

# Research Papers

Read (high-level understanding first):

1. Learning Representations by Back-Propagating Errors (1986)
2. ImageNet Classification with Deep CNNs (AlexNet)
3. Deep Residual Learning for Image Recognition (ResNet)

---

# Major Projects

## Beginner
- MNIST Classifier
- Fashion-MNIST Classifier

## Intermediate
- CIFAR-10 Classifier
- Cats vs Dogs CNN

## Advanced
Create a reusable PyTorch training framework supporting:
- Config files
- Checkpoints
- Metrics
- GPU support
- Resume training

---

# Weekly Goals

- Train 2 models
- Read 1 paper
- Implement 1 concept from scratch
- Push 5 GitHub commits

---

# Completion Checklist

## Core
- [ ] Perceptron
- [ ] Backpropagation
- [ ] Activation Functions
- [ ] Loss Functions

## PyTorch
- [ ] Tensors
- [ ] Autograd
- [ ] DataLoader
- [ ] GPU Training

## Architectures
- [ ] MLP
- [ ] CNN
- [ ] RNN
- [ ] LSTM
- [ ] GRU

## Optimization
- [ ] SGD
- [ ] Adam
- [ ] BatchNorm
- [ ] Dropout

## Projects
- [ ] MNIST
- [ ] CIFAR-10
- [ ] CNN Classifier
- [ ] Training Framework

## Completion Requirement

Before moving to Computer Vision, you should be able to build, train, debug, and evaluate deep neural networks in PyTorch without following a tutorial.
