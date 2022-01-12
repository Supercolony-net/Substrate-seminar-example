pub use brush::contracts::{
    pausable::*,
    psp22::*,
};

#[brush::wrapper]
pub type UsdTokenRef = dyn PSP22 + Pausable;

#[brush::trait_definition]
pub trait UsdToken: PSP22 + Pausable {}