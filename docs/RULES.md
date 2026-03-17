# Monorepo Architecture Specification

## Overview

This document defines the architecture of the monorepo and the
responsibilities of each component of the system.

The project is organized as a monorepo containing:

-   Backend API
-   Frontend Application
-   Blockchain Smart Contracts

The indexer service is NOT included in this version.

------------------------------------------------------------------------

# Monorepo Structure

lottery-certification 
│ 
├ docs 
│ └ spec.md 
│ 
├ services 
│ │ 
│ ├ api 
│ │
│ └ frontend 
│ 
├ blockchain 
│ └ contracts 
│ 
└ scripts

------------------------------------------------------------------------

# Technologies

## Backend

-   Node.js
-   Express
-   MVC architecture

## Frontend

-   React
-   Local state management (no global state libraries required)

## Blockchain

-   Solidity
-   Foundry
-   OpenZeppelin

------------------------------------------------------------------------

# Backend Architecture (Node.js + Express + Ether.js - MVC)

Location: services/api

The backend must follow a modular MVC structure.

## Structure


services/api 
│ 
├ src 
│ 
│ ├ controllers 
│ │ drawController.js 
│ │verifyController.js 
│ 
│ ├ routes 
│ │ drawRoutes.js 
│ │ verifyRoutes.js 
│
│ ├ services 
│ │ drawService.js 
│ │ blockchainService.js 
│ 
│ ├ models 
│ │ drawModel.js 
│ 
│ ├ middlewares 
│ │ authMiddleware.js 
│ │ errorMiddleware.js 
│ 
│ ├ util 
│ │ logger.js 
│ 
│ ├ errores 
│ │AppError.js 
│ 
│ ├ test 
│ │ draw.test.js 
│ 
│ └ app.js 
│ └ package.json

## Responsibilities

### Controllers

-   Handle HTTP requests
-   Call services
-   Return responses

### Models

-   Define data structures
-   Represent business entities

### Routes

-   Define API endpoints
-   Connect routes with controllers

### Services

-   Contain business logic
-   Interact with blockchain layer


### Util

-   General utilities (logging, formatting)

### Errores

-   Custom error classes

### Test

-   Unit and integration tests

# Backend Responsibilities

The backend must:

1.  Accept TXT draw files
2.  Generate SHA256 hash
3.  Send transaction to smart contract
4.  Store transaction hash
5.  Verify draw certification

# API Endpoints

POST /certify-draw\
Uploads a TXT file and certifies it on the blockchain.

POST /verify-draw\
Verifies whether a draw hash exists on the blockchain.

GET /draws\
Returns previously certified draws.


------------------------------------------------------------------------

# Frontend Architecture (React)

Location: services/frontend

## Characteristics

-   Built using React
-   Simple and local state management (useState / useReducer)
-   No complex global state libraries required

## Responsibilities

-   Upload TXT files
-   Trigger certification process
-   Verify certifications
-   Display results to users in PDF downloadable

## Suggested Structure

services/frontend 
│ 
├ src 
│ 
├ components 
│ 
├ pages 
│ 
├ services 
│ ├ hooks 
│ ├ utils 
│ 
└ package.json

------------------------------------------------------------------------

# Blockchain Architecture

Location: blockchain/contracts

## Technologies

-   Solidity
-   Foundry
-   OpenZeppelin

## Requirements

-   Use existing Foundry project (do not recreate)
-   Integrate OpenZeppelin contracts for security and standards

## Responsibilities

-   Store hashes of lottery draws
-   Emit events
-   Provide verification methods

------------------------------------------------------------------------

# General Rules

-   Do not recreate existing project structures
-   Respect existing code
-   Extend only where necessary
-   Maintain clean architecture separation
-   Keep code modular and scalable

------------------------------------------------------------------------

# Security Requirements

The system must:

-   validate uploaded files
-   prevent duplicate certifications
-   restrict certification to authorized addresses